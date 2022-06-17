import AbstractView from '../framework/view/abstract-view.js';

const createStatisticsTemplate = (countFilms) =>
  `<p>${countFilms} movies inside</p>`;

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
