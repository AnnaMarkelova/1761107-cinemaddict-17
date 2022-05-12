import { render, remove } from '../framework/render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmPresenter from './film-presenter.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import SortView from '../view/sort-view.js';
import StatisticsView from '../view/statistics-view.js';

const FILMS_COUNT_PER_STEP = 5;

const footerElement = document.querySelector('.footer');

export default class FilmListPresenter {
  #filmListContainer;
  #filmsModel;
  #films;
  #commentsModel;
  #displayedFilmsCount = 0;

  #filmsComponent = new FilmsView;
  #filmsListComponent = new FilmsListView;
  #filmsListContainerComponent = new FilmsListContainerView;
  #showMoreBtnComponent = new ShowMoreButtonView;

  constructor(filmListContainer, filmsModel, commentsModel) {
    this.#filmListContainer = filmListContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.films];

    this.#renderFilmsBoard();
  };

  #renderFilmsBoard = () => {
    //render(new MainNavigationView(this.#watchList.length, this.#alreadyWatchedList.length, this.#favoriteList.length), this.#filmListContainer);

    if (!this.#films.length) {
      this.#filmsListComponent.init('There are no movies in our database', false);
      render(this.#filmsListComponent, this.#filmsComponent.element);
    } else {
      render(new SortView, this.#filmListContainer);
      render(this.#filmsComponent, this.#filmListContainer);

      this.#renderFilmList();

      this.#renderFilmsListTopRated();
      this.#renderFilmsMostCommented();
    }

    render(new StatisticsView(this.#films.length), footerElement);
  };

  #renderFilmList = () => {
    this.#filmsListComponent.init('All movies. Upcoming', true);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    this.#renderGroupFilms(0, Math.min(this.#films.length, FILMS_COUNT_PER_STEP));

    if (this.#films.length > FILMS_COUNT_PER_STEP) {
      render(this.#showMoreBtnComponent, this.#filmsListComponent.element);
      this.#showMoreBtnComponent.setClickHandler(this.#onShowMoreBtnComponentClick);
    }
  };

  #renderFilmsListTopRated = () => {
    const filmsListTopRatedComponent = new FilmsListView;
    filmsListTopRatedComponent.init('Top rated', false, true);

    const filmsListContainerTopRatedComponent = new FilmsListContainerView;

    render(filmsListTopRatedComponent, this.#filmsComponent.element);
    render(filmsListContainerTopRatedComponent, filmsListTopRatedComponent.element);
    this.#filmsModel.getMostRated().forEach((film) =>
      this.#renderFilm(film, filmsListContainerTopRatedComponent.element));
  };

  #renderFilmsMostCommented = () => {

    const filmsListMostCommentedComponent = new FilmsListView;
    filmsListMostCommentedComponent.init('Most commented', false, true);

    const filmsListContainerMostCommentedComponent = new FilmsListContainerView;

    render(filmsListMostCommentedComponent, this.#filmsComponent.element);
    render(filmsListContainerMostCommentedComponent, filmsListMostCommentedComponent.element);
    this.#filmsModel.getMostCommented().forEach((film) =>
      this.#renderFilm(film, filmsListContainerMostCommentedComponent.element));
  };

  #renderGroupFilms = (from, to) => {
    this.#displayedFilmsCount = Math.min(to, this.#films.length);
    this.#films.slice(from, this.#displayedFilmsCount).forEach((film) => this.#renderFilm(film, this.#filmsListContainerComponent.element));
  };

  #renderFilm = (film, container) => {
    const filmPopup = new FilmPresenter(this.#commentsModel, film, container);
    filmPopup.init();
  };

  #onShowMoreBtnComponentClick = () => {
    this.#renderGroupFilms(this.#displayedFilmsCount, this.#displayedFilmsCount + FILMS_COUNT_PER_STEP);
    if (this.#displayedFilmsCount === this.#films.length) {
      remove(this.#showMoreBtnComponent);
    }
  };

}
