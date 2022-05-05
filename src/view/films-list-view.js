import { createElement } from '../render.js';

const createFilmsListTemplate = (title, hideTitle, isExtra) => `
<section class="films-list ${isExtra ? 'films-list--extra' : ''}">
  <h2 class="films-list__title ${hideTitle ? 'visually-hidden' : ''}">${title}</h2>
</section>`;

export default class FilmsListView {
  #element = null;
  #title;
  #hideTitle;
  #isExtra;

  init = (title, hideTitle = false, isExtra = false) => {
    this.#title = title;
    this.#hideTitle = hideTitle;
    this.#isExtra = isExtra;
  };

  get template() {
    return createFilmsListTemplate(this.#title, this.#hideTitle, this.#isExtra);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
