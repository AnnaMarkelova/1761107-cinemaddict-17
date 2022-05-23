import { isEscapeEvent } from '../util/util.js';
import { render, remove, replace } from '../framework/render.js';
import PopupView from '../view/popup-view.js';

const footerElement = document.querySelector('.footer');
const bodyElement = document.querySelector('body');
export default class PopupPresenter {

  #changeData = null;
  #commentsModel = null;
  #film = null;
  #popupComponent = null;
  #container = footerElement;

  constructor(changeData) {
    this.#changeData = changeData;
  }

  init = (film, commentsModel) => {
    this.#film = film;
    this.#commentsModel = commentsModel;

    const prevPopupComponent = this.#popupComponent;

    this.#popupComponent = new PopupView(this.#film, this.#getFilmComments());

    if (prevPopupComponent === null) {
      this.#renderPopup();
      this.#setupFilmUserDetailHandlers();

      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#onEscKeyDown);
      this.#popupComponent.setClickHandler(this.#onFilmDetailsCloseBtnClick);
      return;
    }

    if (bodyElement.contains(prevPopupComponent.element)) {
      replace(this.#popupComponent, prevPopupComponent);
      this.#setupFilmUserDetailHandlers();

      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#onEscKeyDown);
      this.#popupComponent.setClickHandler(this.#onFilmDetailsCloseBtnClick);
    }

    remove(prevPopupComponent);

  };

  #renderPopup = () => {
    render(this.#popupComponent, this.#container, 'afterend');
  };

  #getFilmComments = () => this.#film.comments.map((item) => this.#commentsModel.getCommentById(item));

  closePopup = () => {
    remove(this.#popupComponent);
    this.#popupComponent = null;
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #setupFilmUserDetailHandlers = () => {
    this.#popupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popupComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
  };

  #handleWatchlistClick = () => {
    this.#changeUserDetail('watchList');
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeUserDetail('alreadyWatched');
  };

  #handleFavoriteClick = () => {
    this.#changeUserDetail('favorite');
  };

  #changeUserDetail = (userDetail) => {
    this.#film.userDetails[userDetail] = !this.#film.userDetails[userDetail];
    this.#changeData({ ...this.#film });
  };

  #onFilmDetailsCloseBtnClick = () => {
    this.closePopup();
  };

  #onEscKeyDown = (evt) => {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this.closePopup();
    }
  };

}
