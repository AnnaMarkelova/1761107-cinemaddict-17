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

const createFilmsListTemplate = (filterType, hideTitle) => `
<h2 class="films-list__title ${hideTitle ? 'visually-hidden' : ''}">${NoFilmsTextType[filterType]}</h2>`;

export default class FilmsListTitleView extends AbstractView{

  #filterType;
  #hideTitle;

  init = (filterType, hideTitle = false) => {
    this.#filterType = filterType;
    this.#hideTitle = hideTitle;
  };

  get template() {
    return createFilmsListTemplate(this.#filterType, this.#hideTitle);
  }

}
