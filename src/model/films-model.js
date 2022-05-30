import Observable from '../framework/observable.js';
import { getFilms } from '../mock/films';
import { sortDateDown } from '../util/util.js';

const EXTRA_FILMS_COUNT = 2;
export default class FilmsModel extends Observable {

  #films = getFilms();

  get films() {
    return this.#films;
  }

  updateFilm = (updateType, update) => {
    this.#films = this.#films.map((item) => item.id === update.id ? update : item);

    // const index = items.findIndex((item) => item.id === update.id);

    // if (index === -1) {
    //   return items;
    // }
    // return [
    //   ...items.slice(0, index),
    //   update,
    //   ...items.slice(index + 1),
    // ];

    this._notify(updateType, update);
  };

  getWatchList = () => this.#films.filter((film) => film.userDetails.watchList);

  getAlreadyWatchedList = () => this.#films.filter((film) => film.userDetails.alreadyWatched);

  getFavoriteList = () => this.#films.filter((film) => film.userDetails.favorite);

  getMostCommented = () => this.#films.slice().sort((filmA, filmB) => filmB.comments.length - filmA.comments.length).slice(0, EXTRA_FILMS_COUNT);

  getMostRated = () => this.getSortRated().slice(0, EXTRA_FILMS_COUNT);

  getSortDateRelease = () => this.#films.slice().sort((filmA, filmB) => sortDateDown(filmB.filmInfo.release.date, filmA.filmInfo.release.date));

  getSortRated = () => this.#films.slice().sort((filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating);
}
