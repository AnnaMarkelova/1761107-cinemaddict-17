import { createElement } from '../render.js';

const createMainNavigationTemplate = (watchListCount, historyCount, favoritesCount) =>
  `<nav class="main-navigation">
  <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
  <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchListCount}</span></a>
  <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${historyCount}</span></a>
  <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoritesCount}</span></a>
  </nav>`;

export default class MainNavigationView {
  #element = null;
  #watchListCount;
  #historyCount;
  #favoritesCount;

  constructor(watchListCount, historyCount, favoritesCount) {
    this.#watchListCount = watchListCount;
    this.#historyCount = historyCount;
    this.#favoritesCount = favoritesCount;
  }

  get template() {
    return createMainNavigationTemplate(this.#watchListCount, this.#historyCount, this.#favoritesCount);
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
