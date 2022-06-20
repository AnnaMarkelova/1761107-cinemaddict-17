import { render } from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import FilmDetailsView from '../view/film-details-view.js';

export default class FilmDetailPresenter {

  #closePopup;
  #container;
  #film;
  #filmDetailComponent;
  #updateData;
  #onEscKeyDown;

  constructor(film, container, updateData, closePopup, onEscKeyDown) {
    this.#container = container;
    this.#film = film;
    this.#updateData = updateData;
    this.#closePopup = closePopup;
    this.#onEscKeyDown = onEscKeyDown;
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

}

