import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createSortItemTemplate = (sortTypeItem, currentSortType) =>
  `<li><a href="#" class="sort__button ${currentSortType === sortTypeItem ? 'sort__button--active' : ''}" data-sort-type="${sortTypeItem}">Sort by ${sortTypeItem}</a></li>`;

const createSortTemplate = (currentSortType, sortList) => {
  const SortsTemplate = [];
  Object.keys(sortList).forEach((sortTypeItem) => {
    SortsTemplate.push(createSortItemTemplate(sortList[sortTypeItem], currentSortType));
  });
  return `<ul class="sort">${SortsTemplate.join('')}</ul>`;
};
export default class SortView extends AbstractView {

  #currentSortType = SortType.DEFAULT;

  get template() {
    return createSortTemplate(this.#currentSortType, SortType);
  }

  init = (currentSortType) => {
    this.#currentSortType = currentSortType;
    this.#rerenderElement();
  };

  #rerenderElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);

    this.setSortTypeChangeHandler();
  };

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.closest('.sort__button')) {
      evt.preventDefault();

      const previousLink = document.querySelector('.sort__button--active');
      previousLink.classList.remove('sort__button--active');
      evt.target.closest('.sort__button').classList.add('sort__button--active');

      this._callback.sortTypeChange(evt.target.closest('.sort__button').dataset.sortType);
    }
  };

}
