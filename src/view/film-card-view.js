import { createElement } from '../render.js';
import { getYearFromDate, transformIntToHour } from '../util.js';

const createFilmCardTemplate = (film) => {
  const {
    comments,
    filmInfo: {
      title,
      totalRating,
      poster,
      release: {date},
      runtime,
      genre,
      description,
    },
    userDetails: {
      watchList,
      alreadyWatched,
      favorite,
    },
  } = film;

  const watchListActive = watchList ? 'film-card__controls-item--active' : '';
  const alreadyWatchedActive = alreadyWatched ? 'film-card__controls-item--active' : '';
  const favoriteActive = favorite ? 'film-card__controls-item--active' : '';

  return `<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${getYearFromDate(date)}</span>
      <span class="film-card__duration">${transformIntToHour(runtime)}</span>
      <span class="film-card__genre">${genre}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <span class="film-card__comments">${comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchListActive}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatchedActive}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteActive}" type="button">Mark as favorite</button>
  </div>
  </article>`;

};
export default class FilmCardView {

  constructor(film) {
    this.film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this.film);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
