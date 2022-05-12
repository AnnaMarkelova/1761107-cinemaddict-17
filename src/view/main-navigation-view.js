import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, isChecked) => {
  const { name, count } = filter;
  if (isChecked) {
    return `<a href="#${name}" class="main-navigation__item main-navigation__item--active">${name}</a>`;
  }
  return `<a href="#${name}" class="main-navigation__item">${name}<span class="main-navigation__item-count">${count}</span></a>`;
};

const createMainNavigationTemplate = (filterItems) => {

  const filtersTemplate = filterItems.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('');
  return `<nav class="main-navigation"> ${filtersTemplate}</nav>`;

};

export default class MainNavigationView extends AbstractView {

  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createMainNavigationTemplate(this.#filters);
  }

}
