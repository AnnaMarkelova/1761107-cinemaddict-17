import { render } from '../framework/render.js';
import { FilterType, SortType, UpdateType, UserAction } from '../const.js';
import { getFilters } from '../util/filter.js';
import { sortDateDown } from '../util/util.js';

import FilmListPresenter from './films-list-presenter.js';
import MainNavigationPresenter from './main-navigation-presenter.js';
import PopupPresenter from './popup-presenter.js';

import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
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
  #popupPresenter;

  #filmsComponent = new FilmsView;
  #filmsListComponent = new FilmsListView;
  #sortComponent = new SortView;


  #currentSortType = SortType.DEFAULT;

  #filmListContainer;

  #filmListPresenters = [];

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
    this.#renderMainNavigation();
    this.#renderProfileView();
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
        this.#updateMainFilmsList(data);
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
          //обновляет карточки фильмов
          this.#filmListPresenters.forEach((presenter) => {
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
        // this.#filmListPresenters.forEach((presenter) => {
        //   this.#updateFilmList(presenter, data);
        // });
        //this.#updateFilmsListBoard(this.films);
        this.#filmListPresenter.init(this.films, true);
        this.#updateFilmList(this.#filmsListTopRatedPresenter, data);
        this.#updateFilmList(this.#filmsListMostCommentedPresenter, data);
        break;
    }
  };

  #updateFilmList = (filmListPresenter, updatedFilm) => {
    const filmPresenterMap = filmListPresenter.getFilmPresenterMap();
    if (filmPresenterMap.has(updatedFilm.id)) {
      filmPresenterMap.get(updatedFilm.id).init(updatedFilm, this.#commentsModel);
    }
  };

  #updateMainFilmsList = (currentFilterType) => {

    if (!this.films.length) {
      this.#renderNoFilms(currentFilterType);
      this.#filmsListComponent.removeElement();
      this.#filmListPresenter.removeElement();
    } else {
      this.#renderSorts(true);
      this.#filmListPresenter.init(this.films);
    }
  };

  #renderFilmsBoard = () => {

    if (!this.films.length) {
      this.#renderNoFilms(FilterType.ALL);
    } else {
      this.#renderSorts();
      this.#renderFilmsList();
    }

  };

  #renderMainNavigation = () => {
    this.#filmListPresenter = new MainNavigationPresenter(mainElement, this.#filterModel, this.#filmsModel);
    this.#filmListPresenter.init();
  };

  #renderProfileView = () => {
    render(new ProfileView(), headerElement);
  };

  #renderNoFilms = (currentFilterType) => {
    this.#filmsListComponent.init(currentFilterType, false);
    render(this.#filmsListComponent, this.#filmsComponent.element);
  };

  #renderSorts = (isUpdate = false) => {
    if (isUpdate) {
      this.#sortComponent.init(this.#currentSortType);
    } else {
      render(this.#sortComponent, this.#filmListContainer);
    }
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
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
    this.#filmListPresenter.init(this.films);
    this.#filmListPresenters.push(this.#filmListPresenter);

    this.#filmsListTopRatedPresenter = new FilmListPresenter(
      this.#filmsComponent,
      this.#handleViewAction,
      this.#handleShowPopup,
      'TopRated',
      false,
      true
    );
    this.#filmsListTopRatedPresenter.init(this.#filmsModel.getMostRated());
    this.#filmListPresenters.push(this.#filmsListTopRatedPresenter);

    this.#filmsListMostCommentedPresenter = new FilmListPresenter(
      this.#filmsComponent,
      this.#handleViewAction,
      this.#handleShowPopup,
      'MostCommented',
      false,
      true
    );
    this.#filmsListMostCommentedPresenter.init(this.#filmsModel.getMostCommented());
    this.#filmListPresenters.push(this.#filmsListMostCommentedPresenter);
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
    this.#filmListPresenter.init(this.films);
  };

}
