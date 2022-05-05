import { getFilms } from '../mock/films';

const EXTRA_FILMS_COUNT = 2;
export default class FilmsModel {

  #films = getFilms();

  get films () {
    return this.#films;
  }

  getWatchList = () => this.#films.filter((film) => film.userDetails.watchList);

  getAlreadyWatchedList = () => this.#films.filter((film) => film.userDetails.alreadyWatched);

  getFavoriteList = () => this.#films.filter((film) => film.userDetails.favorite);

  getMostCommented = () => this.#films.sort((filmA, filmB) => filmB.comments.length - filmA.comments.length).slice(0, EXTRA_FILMS_COUNT);

  getMostRated = () => this.#films.sort((filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating).slice(0, EXTRA_FILMS_COUNT);
}
