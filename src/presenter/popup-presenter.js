import { render } from '../render.js';
import PopupView from '../view/popup-view.js';

export default class PopupPresenter {

  popupComponent = new PopupView();

  init = (popupContainer) => {
    this.popupContainer = popupContainer;
    render(this.popupComponent, this.popupContainer, 'afterend');
  };
}