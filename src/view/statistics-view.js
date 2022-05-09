import AbstractView from '../framework/view/abstract-view.js';

const createStatisticsTemplate = (countFilms) =>
  `<section class="footer__statistics">
    <p>${countFilms} movies inside</p>
  </section>`;

export default class StatisticsView extends AbstractView {

  #countFilms;

  constructor(countFilms) {
    super();
    this.#countFilms = countFilms;
  }

  get template() {
    return createStatisticsTemplate(this.#countFilms);
  }

}
