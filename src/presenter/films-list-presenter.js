import { render } from '../render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmPresenter from './film-presenter.js';

const FILMS_COUNT_PER_STEP = 5;

export default class FilmListPresenter {
  #filmListContainer;
  #filmsModel;
  #films;
  #commentsModel;
  #displayedFilmsCount = 0;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView('All movies. Upcoming', true);
  #filmsListContainerComponent = new FilmsListContainerView();

  #filmsListTopRatedComponent = new FilmsListView('Top rated', false, true);
  #filmsListContainerTopRatedComponent = new FilmsListContainerView();

  #filmsListMostCommentedComponent = new FilmsListView('Most commented', false, true);
  #filmsListContainerMostCommentedComponent = new FilmsListContainerView();

  #showMoreBtnComponent = new ShowMoreButtonView();

  init = (filmListContainer, filmsModel, commentsModel) => {
    this.#filmListContainer = filmListContainer;
    this.#filmsModel = filmsModel;
    this.#films = [...this.#filmsModel.films];
    this.#commentsModel = commentsModel;

    render(this.#filmsComponent, this.#filmListContainer);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    this.#renderGroupFilms(0, Math.min(this.#films.length, FILMS_COUNT_PER_STEP));

    if (this.#films.length > FILMS_COUNT_PER_STEP) {
      render(this.#showMoreBtnComponent, this.#filmsListComponent.element);
      this.#showMoreBtnComponent.element.addEventListener('click', this.#onShowMoreBtnComponentClick);
    }

    render(this.#filmsListTopRatedComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerTopRatedComponent, this.#filmsListTopRatedComponent.element);

    for (let i = 0; i < 2; i++) {
      this.#renderFilm(this.#films[i], this.#filmsListContainerTopRatedComponent.element);
    }

    render(this.#filmsListMostCommentedComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerMostCommentedComponent, this.#filmsListMostCommentedComponent.element);

    for (let i = 0; i < 2; i++) {
      this.#renderFilm(this.#films[i], this.#filmsListContainerMostCommentedComponent.element);
    }
  };

  #renderGroupFilms = (from, to) => {
    this.#displayedFilmsCount = Math.min(to, this.#films.length);
    this.#films.slice(from, this.#displayedFilmsCount).forEach((film) => this.#renderFilm(film, this.#filmsListContainerComponent.element));
  };

  #renderFilm = (film, container) => {
    const filmPopup = new FilmPresenter;
    filmPopup.init(this.#commentsModel, film, container);
  };

  #onShowMoreBtnComponentClick = (evt) => {
    evt.preventDefault();
    this.#renderGroupFilms(this.#displayedFilmsCount, this.#displayedFilmsCount + FILMS_COUNT_PER_STEP);
    if (this.#displayedFilmsCount === this.#films.length) {
      this.#showMoreBtnComponent.element.remove();
      this.#showMoreBtnComponent.removeElement();
    }
  };

}
