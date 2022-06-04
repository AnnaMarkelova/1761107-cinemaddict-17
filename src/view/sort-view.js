import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createSortItemTemplate = (sortTypeItem, currentSortType) =>
  `<li><a href="#" class="sort__button ${currentSortType === sortTypeItem ? 'sort__button--active' : ''}" data-sort-type="${sortTypeItem}">Sort by ${sortTypeItem}</a></li>`;

const createSortTemplate = (currentSortType, sortList, isNoList) => {

  if (isNoList) {
    return '<div></div>';
  }

  const SortsTemplate = [];
  Object.keys(sortList).forEach((sortTypeItem) => {
    SortsTemplate.push(createSortItemTemplate(sortList[sortTypeItem], currentSortType));
  });
  return `<ul class="sort">${SortsTemplate.join('')}</ul>`;
};
export default class SortView extends AbstractView {

  #currentSortType = SortType.DEFAULT;
  #isNoList;

  constructor(isNoList = false) {
    super();
    this.#isNoList = isNoList;
  }

  get template() {

    return createSortTemplate(this.#currentSortType, SortType, this.#isNoList);

  }

  init = (currentSortType) => {

    this.#currentSortType = currentSortType;
    this.setSortTypeChangeHandler();

  };

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.closest('.sort__button')) {
      evt.preventDefault();
      this._callback.sortTypeChange(evt.target.closest('.sort__button').dataset.sortType);
    }
  };

}
