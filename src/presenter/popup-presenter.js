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
  #changeMode =null;

  constructor(changeData, changeMode) {
    this.#changeData = changeData;
    this.#changeMode = changeMode;
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

  #getFilmComments = () => {
    const filmComments = [];
    this.#film.comments.forEach((item) => {
      filmComments.push(this.#commentsModel.getCommentById(item));
    });
    return filmComments;
  };

  closePopup = () => {
    remove(this.#popupComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
  };

  #setupFilmUserDetailHandlers = () => {
    this.#popupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popupComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
  };

  #handleWatchlistClick = () => {
    this.#film.userDetails.watchList = !this.#film.userDetails.watchList;
    this.#changeData({ ...this.#film });
  };

  #handleAlreadyWatchedClick = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#changeData({ ...this.#film });
  };

  #handleFavoriteClick = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
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
