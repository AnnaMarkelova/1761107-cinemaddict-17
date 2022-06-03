import AbstractView from '../framework/view/abstract-view.js';


const createFilmsListTemplate = (isExtra) => `<section class="films-list ${isExtra ? 'films-list--extra' : ''}"></section>`;

export default class FilmsListView extends AbstractView{

  #isExtra;

  init = (isExtra = false) => {
    this.#isExtra = isExtra;
  };

  get template() {
    return createFilmsListTemplate(this.#isExtra);
  }

}
