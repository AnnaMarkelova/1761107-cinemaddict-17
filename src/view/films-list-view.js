import { FilterType } from '../const.js';

import AbstractView from '../framework/view/abstract-view.js';

const NoFilmsTextType = {
  'AllMovie': 'All movies. Upcoming',
  'TopRated': 'Top rated',
  'MostCommented': 'Most commented',
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.WATCH_LIST]: 'There are no movies to watch now',
};

const createFilmsListTemplate = (filterType, hideTitle, isExtra) => `
<section class="films-list ${isExtra ? 'films-list--extra' : ''}">
  <h2 class="films-list__title ${hideTitle ? 'visually-hidden' : ''}">${NoFilmsTextType[filterType]}</h2>
</section>`;

export default class FilmsListView extends AbstractView{

  #filterType;
  #hideTitle;
  #isExtra;

  init = (filterType, hideTitle = false, isExtra = false) => {
    this.#filterType = filterType;
    this.#hideTitle = hideTitle;
    this.#isExtra = isExtra;
    this.#rerenderElement();
  };

  get template() {
    return createFilmsListTemplate(this.#filterType, this.#hideTitle, this.#isExtra);
  }

  #rerenderElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);
  };

}
