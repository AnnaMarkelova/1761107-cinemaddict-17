import { createElement } from '../render.js';

const createFilmsListTemplate = (modifierCSS, modifierHTML) => `<section class="films-list ${modifierCSS}">${modifierHTML}</section>`;

export default class FilmsListView {

  modifierCSS;
  modifierHTML;

  constructor(modifierCSS = '', modifierHTML = '') {
    this.modifierCSS = modifierCSS;
    this.modifierHTML = modifierHTML;
  }

  getTemplate() {
    return createFilmsListTemplate(this.modifierCSS, this.modifierHTML);
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
