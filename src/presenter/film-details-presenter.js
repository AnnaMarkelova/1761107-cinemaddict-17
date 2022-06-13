import { isEscapeEvent } from '../util/util.js';
import { render } from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import FilmDetailsView from '../view/film-details-view.js';

export default class FilmDetailPresenter {

  #closePopup;
  #container;
  #film;
  #filmDetailComponent;
  #updateData;

  constructor(film, container, updateData, closePopup) {
    this.#container = container;
    this.#film = film;
    this.#updateData = updateData;
    this.#closePopup = closePopup;
  }

  init = () => {
    this.#filmDetailComponent = new FilmDetailsView(this.#film);
    this.#renderFilmDetail();
    this.#setupFilmUserDetailHandlers();
    this.#setupCloseHandlers();
  };

  #renderFilmDetail = () => {
    render(this.#filmDetailComponent, this.#container.element);
  };

  #setupCloseHandlers = () => {
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#filmDetailComponent.setClickHandler(this.#onFilmDetailsCloseBtnClick);
  };

  #setupFilmUserDetailHandlers = () => {
    this.#filmDetailComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmDetailComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmDetailComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
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

  #onFilmDetailsCloseBtnClick = () => {
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#closePopup();
  };

  #onEscKeyDown = (evt) => {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#onEscKeyDown);
      this.#closePopup();
    }
  };

}

