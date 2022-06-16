import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, name, count } = filter;

  const countSection = `<span class="main-navigation__item-count">${count}</span>`;

  return `<a href="#${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter-type="${type}">
    ${name}
    ${type === 'all' ? '' : countSection}
    </a>`;

};

const createMainNavigationTemplate = (filterItems, currentFilterType) => {

  const filtersTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');
  return `<nav class="main-navigation"> ${filtersTemplate}</nav>`;

};

export default class MainNavigationView extends AbstractView {

  #filters = null;
  #currentFilterType = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createMainNavigationTemplate(this.#filters, this.#currentFilterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.closest('.main-navigation')) {
      evt.preventDefault();
      this._callback.filterChange(evt.target.closest('.main-navigation__item').dataset.filterType);
    }
  };

}
