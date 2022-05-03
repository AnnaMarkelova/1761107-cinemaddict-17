import { createElement } from '../render.js';

const createFilmsListTemplate = (title, hideTitle, isExtra) => `
<section class="films-list ${isExtra ? 'films-list--extra' : ''}">
  <h2 class="films-list__title ${hideTitle ? 'visually-hidden' : ''}">${title}</h2>
</section>`;

export default class FilmsListView {

  title;
  hideTitle;
  isExtra;

  constructor(title, hideTitle = false, isExtra = false) {
    this.title = title;
    this.hideTitle = hideTitle;
    this.isExtra = isExtra;
  }

  getTemplate() {
    return createFilmsListTemplate(this.title, this.hideTitle, this.isExtra);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
