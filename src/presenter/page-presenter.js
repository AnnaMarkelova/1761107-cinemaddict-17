import { render, remove, replace } from '../framework/render.js';
import { SortType, UpdateType, UserAction } from '../const.js';
import { getFilters } from '../util/filter.js';
import { sortDateDown } from '../util/util.js';

import FilmListPresenter from './films-list-presenter.js';
import MainNavigationPresenter from './main-navigation-presenter.js';
import PopupPresenter from './popup-presenter.js';

import FilmsView from '../view/films-view.js';
import LoadingView from '../view/loading-view.js';
import SortView from '../view/sort-view.js';
import StatisticsView from '../view/statistics-view.js';
import ProfileView from '../view/profile-view.js';

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerStatisticElement = document.querySelector('.footer__statistics');

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
  #loadingComponent = new LoadingView();
  #profileComponent = null;
  #statisticComponent = null;

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

    this.#popupPresenter = new PopupPresenter(this.#commentsModel, this.#handleViewAction);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    const sortObject = this.#sorts.find((item) => item.sortType === this.#currentSortType);
    const filteredFilms = getFilters().get(this.#filterModel.filter)(this.#filmsModel);
    const films = sortObject ? sortObject.sortFilms(filteredFilms) : filteredFilms;
    return films;
  }

  init = () => {
    this.#renderProfileView();
    this.#renderMainNavigation();
    this.#renderLoading();
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
        this.#popupPresenter.init(data);
        this.#updateFilm(this.#filmsListTopRatedPresenter, data);
        this.#updateFilm(this.#filmsListMostCommentedPresenter, data);
        break;
      case UpdateType.INIT_FILM:
        remove(this.#loadingComponent);
        this.#renderProfileView();
        // this.#renderMainNavigation();
        this.#renderFilmsBoard();
        this.#renderStatistic();
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
      render(this.#filmsComponent, this.#filmListContainer);
      this.#filmListPresenter = this.#renderFilmsListPresenter(this.films, 'AllMovie', true, false, this.#filterModel.filter);
      this.#filmsListTopRatedPresenter = this.#renderFilmsListPresenter(this.#filmsModel.getMostRated(), 'TopRated', false, true, null);
      this.#filmsListMostCommentedPresenter = this.#renderFilmsListPresenter(this.#filmsModel.getMostCommented(), 'MostCommented', false, true, null);
    } else {
      render(this.#filmsComponent, this.#filmListContainer);

      this.#filmListPresenter = this.#renderFilmsListPresenter(this.films, 'AllMovie', true, false, this.#filterModel.filter);
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
    this.#sortComponent = new SortView(!this.films.length);

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

  #renderFilmsListPresenter = (films, title, hideTitle, isExtra, currentFilterType) => {
    const newPresenter = new FilmListPresenter(
      this.#filmsComponent,
      this.#handleViewAction,
      this.#handleShowPopup,
      title,
      hideTitle,
      isExtra
    );
    newPresenter.init(films, currentFilterType);
    this.#filmListPresentersMap.push(newPresenter);
    return newPresenter;
  };

  #renderProfileView = () => {
    // this.#profileComponent = new ProfileView();
    // render(this.#profileComponent, headerElement);

    const prevProfileComponent= this.#profileComponent;
    this.#profileComponent = new ProfileView();

    if (prevProfileComponent === null) {
      render(this.#profileComponent, headerElement);
      return;
    }

    if (headerElement.contains(prevProfileComponent.element)) {
      replace(this.#profileComponent, prevProfileComponent);

    }
    remove(prevProfileComponent);

  };

  #renderStatistic = () => {
    // this.#statisticComponent = new StatisticsView(this.#filmsModel.films.length);
    // render(this.#statisticComponent, footerElement);

    const prevStatisticComponent= this.#statisticComponent;
    this.#statisticComponent = new StatisticsView(this.#filmsModel.films.length);

    if (prevStatisticComponent === null) {
      render(this.#statisticComponent, footerStatisticElement);
      return;
    }

    if (footerStatisticElement.contains(prevStatisticComponent.element)) {
      replace(this.#statisticComponent, prevStatisticComponent);

    }
    remove(prevStatisticComponent);

  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmListContainer);
  };

  #handleShowPopup = (film) => {
    this.#popupPresenter.init(film);
  };

  #handleSortTypeChange = (sortType) => {

    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;

    this.#updateMainFilmsList();
  };

}
