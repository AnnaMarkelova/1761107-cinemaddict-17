import { render, remove, replace } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import FilmCardView from '../view/film-card-view.js';

export default class FilmPresenter {

  #updateData = null;
  #showPopup = null;
  #setCurrentFilmPopup = null;

  #container = null;
  #film = null;
  #prevFilm = null;
  #filmCardComponent = null;

  constructor(container, updateData, showPopup, setCurrentFilmPopup) {
    this.#container = container;
    this.#updateData = updateData;
    this.#showPopup = showPopup;
    this.#setCurrentFilmPopup = setCurrentFilmPopup;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmCardComponent = this.#filmCardComponent;
    this.#filmCardComponent = new FilmCardView(this.#film);

    if (prevFilmCardComponent === null) {
      this.#renderFilm();
      this.#filmCardComponent.setClickHandler(this.#onFilmCardClick);
      this.#setupUserDetailHandlers();
      return;
    }

    if (this.#container.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
      this.#filmCardComponent.setClickHandler(this.#onFilmCardClick);
      this.#setupUserDetailHandlers();
      if (this.#prevFilm?.id === this.#film.id) {
        this.#prevFilm = film;
        this.#setCurrentFilmPopup(film);
        this.#showPopup(this.#film);
      }

    }
    remove(prevFilmCardComponent);
  };

  #renderFilm = () => {
    render(this.#filmCardComponent, this.#container);
  };

  #setupUserDetailHandlers = () => {
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
  };

  #onFilmCardClick = () => {
    this.#setCurrentFilmPopup(this.#film);
    this.#showPopup(this.#film);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };

  #handleWatchlistClick = () => {
    this.#changeUserDetail('watchlist');
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeUserDetail('alreadyWatched');
  };

  #handleFavoriteClick = () => {
    this.#changeUserDetail('favorite');
  };

  #changeUserDetail = (userDetail) => {
    this.#film.userDetails[userDetail] = !this.#film.userDetails[userDetail];
    this.#updateData(
      UserAction.UPDATE_FILMS,
      UpdateType.MAJOR,
      { ...this.#film },
    );
  };

}
