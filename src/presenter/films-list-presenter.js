import { render, remove } from '../framework/render.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmPresenter from './film-presenter.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

const FILMS_COUNT_PER_STEP = 5;

export default class FilmListPresenter {

  #handleDeletePopups = null;
  #handleFilmChange = null;
  #commentsModel;
  #displayedFilmsCount = 0;
  #isExtra;
  #hideTitle;
  #films;
  #filmsComponent;
  #filmsListComponent;
  #filmsListContainerComponent = new FilmsListContainerView;
  #showMoreBtnComponent = new ShowMoreButtonView;
  #title;

  #filmPresenterMap = new Map();

  constructor(filmsComponent, films, commentsModel,handleFilmChange, handleDeletePopups, title, hideTitle = false, isExtra = false) {
    this.#films = films;
    this.#commentsModel = commentsModel;
    this.#filmsComponent = filmsComponent;

    this.#handleFilmChange = handleFilmChange;
    this.#handleDeletePopups = handleDeletePopups;

    this.#title = title;
    this.#hideTitle = hideTitle;
    this.#isExtra = isExtra;
  }

  init = () => {
    this.#renderFilmList();
  };

  #renderFilmList = () => {
    this.#filmsListComponent = new FilmsListView;
    this.#filmsListComponent.init(this.#title, this.#hideTitle, this.#isExtra);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    this.#renderGroupFilms(0, Math.min(this.#films.length, FILMS_COUNT_PER_STEP));

    if (this.#films.length > FILMS_COUNT_PER_STEP) {
      render(this.#showMoreBtnComponent, this.#filmsListComponent.element);
      this.#showMoreBtnComponent.setClickHandler(this.#onShowMoreBtnComponentClick);
    }
  };

  #renderGroupFilms = (from, to) => {
    this.#displayedFilmsCount = Math.min(to, this.#films.length);
    this.#films.slice(from, this.#displayedFilmsCount).forEach((film) => this.#renderFilm(film, this.#filmsListContainerComponent.element));
  };

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(container, this.#handleFilmChange, this.#handleDeletePopups);
    filmPresenter.init(film, this.#commentsModel);
    this.#filmPresenterMap.set(film.id, filmPresenter);
  };

  #onShowMoreBtnComponentClick = () => {
    this.#renderGroupFilms(this.#displayedFilmsCount, this.#displayedFilmsCount + FILMS_COUNT_PER_STEP);
    if (this.#displayedFilmsCount === this.#films.length) {
      remove(this.#showMoreBtnComponent);
    }
  };

  // #clearFilmList = () => {
  //   this.#filmPresenterMap.forEach((presenter) => presenter.destroy());
  //   this.#filmPresenterMap.clear();
  //   this.#displayedFilmsCount = 0;
  //   remove(this.#showMoreBtnComponent);
  // };

  getFilmPresenterMap = () => this.#filmPresenterMap;

}
