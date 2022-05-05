import { createElement } from '../render.js';

const createStatisticsTemplate = (countFilms) =>
  `<section class="footer__statistics">
    <p>${countFilms} movies inside</p>
  </section>`;

export default class StatisticsView {
  #element = null;
  #countFilms;

  constructor(countFilms) {
    this.#countFilms = countFilms;
  }

  get template() {
    return createStatisticsTemplate(this.#countFilms);
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
