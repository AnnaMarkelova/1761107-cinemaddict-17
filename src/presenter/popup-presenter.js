import { render } from '../render.js';
import PopupView from '../view/popup-view.js';

export default class PopupPresenter {

  init = (popupContainer, filmsModel) => {
    this.popupContainer = popupContainer;
    this.filmsModel = filmsModel;
    this.films = [...filmsModel.getFilms()];

    render(new PopupView(this.films[0].film, this.films[0].comments), this.popupContainer, 'afterend');
  };
}
