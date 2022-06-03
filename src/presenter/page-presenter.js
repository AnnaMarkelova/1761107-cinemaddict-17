import { render, remove, replace } from '../framework/render.js';
import { SortType, UpdateType, UserAction } from '../const.js';
import { getFilters } from '../util/filter.js';
import { sortDateDown } from '../util/util.js';

import FilmListPresenter from './films-list-presenter.js';
import MainNavigationPresenter from './main-navigation-presenter.js';
import PopupPresenter from './popup-presenter.js';

import FilmsView from '../view/films-view.js';
import SortView from '../view/sort-view.js';
import StatisticsView from '../view/statistics-view.js';
import ProfileView from '../view/profile-view.js';

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');

export default class PagePresenter {

  #commentsModel;
  #filmsModel;
  #filterModel;

  #filmsListMostCommentedPresenter;
  #filmListPresenter;
  #filmsListTopRatedPresenter;
  #mainNavigationPresenter;
  #popupPresenter;

  #filmsComponent = new FilmsView;
  #sortComponent = null;

  #currentSortType = SortType.DEFAULT;

  #filmListContainer;

  #filmListPresentersMap = [];

  #sorts = [
    {
      sortType: SortType.DEFAULT,
      sortFilms: (filteredFilms) => filteredFilms,
    },
    {
      sortType: SortType.DATE,
      sortFilms: (filteredFilms) => filteredFilms.slice().sort((filmA, filmB) => sortDateDown(filmB.filmInfo.release.date, filmA.filmInfo.release.date)),
    },
    {
      sortType: SortType.RATING,
      sortFilms: (filteredFilms) => filteredFilms.slice().sort((filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating),
    },
  ];

  constructor(filmListContainer, filmsModel, commentsModel, filterModel) {

    this.#filmListContainer = filmListContainer;

    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#popupPresenter = new PopupPresenter(this.#handleViewAction);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    const sortObject = this.#sorts.find((item) => item.sortType === this.#currentSortType);
    const filteredFilms = getFilters().get(this.#filterModel.filter)(this.#filmsModel);
    if (sortObject) {
      return sortObject.sortFilms(filteredFilms);
    }
    return filteredFilms;
  }

  init = () => {
    this.#renderProfileView();
    this.#renderMainNavigation();
    this.#renderFilmsBoard();
    this.#renderStatistic();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILMS:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#currentSortType = SortType.DEFAULT;
        this.#updateMainFilmsList();
        break;
      case UpdateType.MINOR:
        {
          if (data.isDelete) {
            //удаляет комментарий в фильме
            this.#filmsModel.deleteComment(data.film, data.comment.id);
          } else {
            //добавляет комментарий в фильме
            this.#filmsModel.addComment(data.film, data.comment.id);
          }
          //обновляет карточку фильма
          this.#filmListPresentersMap.forEach((presenter) => {
            const filmPresenter = presenter.getFilmPresenterMap().get(data.film.id);
            if (filmPresenter) {
              filmPresenter.init(data.film, true);
            }
          });
          //перерисовывает most commented
          this.#filmsListMostCommentedPresenter.init(this.#filmsModel.getMostCommented());
        }
        break;
      case UpdateType.MAJOR:
        this.#renderSorts();
        this.#filmListPresenter.init(this.films, this.#filterModel.filter, true);
        this.#updateFilm(this.#filmsListTopRatedPresenter, data);
        this.#updateFilm(this.#filmsListMostCommentedPresenter, data);
        break;
    }
  };

  #updateFilm = (filmListPresenter, updatedFilm) => {
    const filmPresenterMap = filmListPresenter.getFilmPresenterMap();
    if (filmPresenterMap.has(updatedFilm.id)) {
      filmPresenterMap.get(updatedFilm.id).init(updatedFilm, this.#commentsModel);
    }
  };

  #renderFilmsBoard = () => {

    if (this.films.length) {
      this.#renderSorts();
      this.#renderFilmsList();
      this.#renderExtraFilmsList();
    } else {
      this.#renderFilmsList();
    }

  };

  #updateMainFilmsList = () => {
    this.#renderSorts();
    this.#filmListPresenter.init(this.films, this.#filterModel.filter);
  };

  #renderMainNavigation = () => {
    this.#mainNavigationPresenter = new MainNavigationPresenter(mainElement, this.#filterModel, this.#filmsModel);
    this.#mainNavigationPresenter.init();
  };

  #renderSorts = () => {
    const prevSortComponent = this.#sortComponent;
    if (this.films.length) {
      this.#sortComponent = new SortView;
    } else {
      this.#sortComponent = new SortView(true);
    }

    if (prevSortComponent === null) {
      render(this.#sortComponent, this.#filmListContainer);
      this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
      return;
    }

    if (this.#filmListContainer.contains(prevSortComponent.element)) {

      this.#sortComponent.init(this.#currentSortType);
      replace(this.#sortComponent, prevSortComponent);
      this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    }
    remove(prevSortComponent);
  };

  #renderFilmsList = () => {
    render(this.#filmsComponent, this.#filmListContainer);
    this.#filmListPresenter = new FilmListPresenter(
      this.#filmsComponent,
      this.#handleViewAction,
      this.#handleShowPopup,
      'AllMovie',
      true,
      false
    );
    this.#filmListPresenter.init(this.films, this.#filterModel.filter);
    this.#filmListPresentersMap.push(this.#filmListPresenter);
  };

  // #renderFilmsList = (presenter, films, title, hideTitle, isExtra, currentFilterType) => {
  //   render(this.#filmsComponent, this.#filmListContainer);
  //   presenter = new FilmListPresenter(
  //     this.#filmsComponent,
  //     this.#handleViewAction,
  //     this.#handleShowPopup,
  //     title,
  //     hideTitle,
  //     isExtra
  //   );
  //   presenter.init(films, currentFilterType);
  //   this.#filmListPresentersMap.push(presenter);
  // };


  // this.#renderFilmsList(this.#filmListPresenter, this.films,  'AllMovie', true, false, this.#filterModel.filter);
  // this.#renderFilmsList(this.#filmsListTopRatedPresenter, this.#filmsModel.getMostRated(),  'TopRated', false, true, null);
  // this.#renderFilmsList(this.#filmsListMostCommentedPresenter, this.#filmsModel.getMostCommented(),  'MostCommented', false, true, null);

  #renderExtraFilmsList = () => {
    this.#filmsListTopRatedPresenter = new FilmListPresenter(
      this.#filmsComponent,
      this.#handleViewAction,
      this.#handleShowPopup,
      'TopRated',
      false,
      true
    );
    this.#filmsListTopRatedPresenter.init(this.#filmsModel.getMostRated());
    this.#filmListPresentersMap.push(this.#filmsListTopRatedPresenter);

    this.#filmsListMostCommentedPresenter = new FilmListPresenter(
      this.#filmsComponent,
      this.#handleViewAction,
      this.#handleShowPopup,
      'MostCommented',
      false,
      true
    );
    this.#filmsListMostCommentedPresenter.init(this.#filmsModel.getMostCommented());
    this.#filmListPresentersMap.push(this.#filmsListMostCommentedPresenter);
  };

  #renderProfileView = () => {
    render(new ProfileView(), headerElement);
  };

  #renderStatistic = () => {
    render(new StatisticsView(this.#filmsModel.films.length), footerElement);
  };

  #handleShowPopup = (film) => {
    this.#popupPresenter.init(film, this.#commentsModel);
  };

  #handleSortTypeChange = (sortType) => {

    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;

    this.#updateMainFilmsList();
  };

}
