import { render } from '../render.js';
import PopupView from '../view/popup-view.js';

export default class PopupPresenter {
  #popupContainer;
  #filmsModel;
  #films;
  #commentsModel;
  #comments;

  init = (popupContainer, filmsModel, commentsModel) => {
    this.#popupContainer = popupContainer;
    this.#filmsModel = filmsModel;
    this.#films = [...this.#filmsModel.films];
    this.#commentsModel = commentsModel;
    this.#comments = [...this.#commentsModel.comments];

    render(new PopupView(this.#films[0], this.#comments), this.#popupContainer, 'afterend');
  };
}
