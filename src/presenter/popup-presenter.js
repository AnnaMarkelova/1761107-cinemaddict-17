import { render } from '../render.js';
import PopupView from '../view/popup-view.js';

export default class PopupPresenter {
  #popupContainer;
  #commentsModel;
  #film;
  #comments = [];

  init = (popupContainer, commentsModel, film) => {
    this.#popupContainer = popupContainer;
    this.#commentsModel = commentsModel;
    this.#film = film;
    this.#getComments();
  };

  #getComments = () => {
    this.#film.comments.forEach((item) => {
      this.#comments.push(this.#commentsModel.getCommentById(item));
    });
  };

  renderPopup = () => {
    this.PopupView = new PopupView(this.#film, this.#comments);
    render(this.PopupView, this.#popupContainer, 'afterend');
  };
}
