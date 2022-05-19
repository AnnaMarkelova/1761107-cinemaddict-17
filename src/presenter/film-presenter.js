import { render, remove, replace } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import PopupPresenter from './popup-presenter.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  OPEN_POPUP: 'OPEN_POPUP',
};
export default class FilmPresenter {

  #changeData = null;
  #deletePopups = null;
  #container = null;
  #commentsModel = null;
  #mode = Mode.DEFAULT;
  #film = null;
  #filmCardComponent = null;
  #popupPresenter = null;

  constructor(container, changeData, deletePopups) {
    this.#container = container;
    this.#changeData = changeData;
    this.#deletePopups = deletePopups;
  }

  init = (film, commentsModel) => {
    this.#film = film;
    this.#commentsModel = commentsModel;

    const prevFilmCardComponent = this.#filmCardComponent;
    this.#filmCardComponent = new FilmCardView(this.#film);

    if (prevFilmCardComponent === null) {
      this.#renderFilm();
      this.#filmCardComponent.setClickHandler(this.#onFilmCardClick);
      this.#setupPopupUserDetailHandlers();
      return;
    }

    if (this.#container.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
      this.#filmCardComponent.setClickHandler(this.#onFilmCardClick);
      this.#setupPopupUserDetailHandlers();
      if (this.#popupPresenter !== null) {
        this.#popupPresenter.init(this.#film, this.#commentsModel);
      }
    }

    remove(prevFilmCardComponent);
  };

  #renderFilm = () => {
    render(this.#filmCardComponent, this.#container);
  };

  #setupPopupUserDetailHandlers = () => {
    this.#filmCardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmCardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
  };

  #onFilmCardClick = () => {
    this.#deletePopups();
    this.#mode = Mode.OPEN_POPUP;
    this.#popupPresenter = new PopupPresenter(this.#changeData, this.#handleChangeMode);
    this.#popupPresenter.init(this.#film, this.#commentsModel);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchList = !this.#film.userDetails.watchList;
    this.#changeData({...this.#film});
  };

  #handleAlreadyWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#changeData({...this.#film});
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#changeData({...this.#film});
  };

  deletePopup = () => {
    if (this.#mode === Mode.OPEN_POPUP) {
      this.#popupPresenter.closePopup();
    }
  };

  #handleChangeMode = () => {
    this.#mode = Mode.DEFAULT;
  };
}
