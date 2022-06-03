import { render, remove, RenderPosition } from '../framework/render.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListTitleView from '../view/films-list-title-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmPresenter from './film-presenter.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

const FILMS_COUNT_PER_STEP = 5;

export default class FilmListPresenter {

  #currentFilterType;
  #handleShowPopup = null;
  #handleFilmChange = null;

  #displayedFilmsCount = 0;
  #hideTitle;
  #isExtra;
  #films;
  #title;

  #filmsComponent;
  #filmsListComponent = null;
  #filmsListTitleComponent = null;
  #filmsListContainerComponent = new FilmsListContainerView;
  #showMoreBtnComponent = new ShowMoreButtonView;

  #filmPresenterMap = new Map();

  constructor(filmsComponent, handleFilmChange, handleShowPopup, title, hideTitle = false, isExtra = false) {
    this.#filmsComponent = filmsComponent;

    this.#handleFilmChange = handleFilmChange;
    this.#handleShowPopup = handleShowPopup;

    this.#title = title;
    this.#hideTitle = hideTitle;
    this.#isExtra = isExtra;
  }

  init = (films, currentFilterType = null, resetDisplayedFilmsCount = false) => {

    this.#films = films;
    this.#currentFilterType = currentFilterType;

    if (this.#filmsListComponent === null) {
      this.#renderFilmListBoard();
    } else {
      this.#clearFilmList();
    }

    this.#renderListTitle();

    if (this.#films.length > 0) {
      this.#renderFilmList(resetDisplayedFilmsCount);
    }
  };

  #renderFilmListBoard = () => {
    this.#filmsListComponent = new FilmsListView;
    this.#filmsListTitleComponent = new FilmsListTitleView;
    this.#filmsListComponent.init(this.#isExtra);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    if (this.#films.length > 0) {
      render(this.#filmsListContainerComponent, this.#filmsListComponent.element);
    }
  };

  #renderListTitle = () => {
    if (this.#films.length <= 0 && !this.#isExtra) {
      this.#filmsListTitleComponent.init(this.#currentFilterType, false);
    } else {
      this.#filmsListTitleComponent.init(this.#title, this.#hideTitle);
    }

    render(this.#filmsListTitleComponent, this.#filmsListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderFilmList = (resetDisplayedFilmsCount) => {

    let filmsCount = resetDisplayedFilmsCount ? this.#displayedFilmsCount : FILMS_COUNT_PER_STEP;
    if (this.#displayedFilmsCount && resetDisplayedFilmsCount) {
      filmsCount = this.#displayedFilmsCount;
    } else {
      this.#displayedFilmsCount = 0;
    }

    this.#renderGroupFilms(0, Math.min(this.#films.length, filmsCount));

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
    const filmPresenter = new FilmPresenter(container, this.#handleFilmChange, this.#handleShowPopup);
    filmPresenter.init(film);
    this.#filmPresenterMap.set(film.id, filmPresenter);
  };

  #onShowMoreBtnComponentClick = () => {
    this.#renderGroupFilms(this.#displayedFilmsCount, this.#displayedFilmsCount + FILMS_COUNT_PER_STEP);
    if (this.#displayedFilmsCount === this.#films.length) {
      remove(this.#showMoreBtnComponent);
    }
  };

  #clearFilmList = () => {
    remove(this.#filmsListTitleComponent);
    this.#filmPresenterMap.forEach((presenter) => presenter.destroy());
    this.#filmPresenterMap.clear();
    remove(this.#showMoreBtnComponent);
  };

  getFilmPresenterMap = () => this.#filmPresenterMap;

}
