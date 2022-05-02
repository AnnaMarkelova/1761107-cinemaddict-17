import { render } from '../render.js';
import PopupView from '../view/popup-view.js';

export default class PopupPresenter {

  init = (popupContainer, filmsModel, commentsModel) => {
    this.popupContainer = popupContainer;
    this.filmsModel = filmsModel;
    this.films = [...filmsModel.getFilms()];
    this.commentsModel = commentsModel;
    this.comments = [...commentsModel.getComments()];

    render(new PopupView(this.films[0], this.comments), this.popupContainer, 'afterend');
  };
}
