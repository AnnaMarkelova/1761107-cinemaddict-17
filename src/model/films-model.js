import Observable from '../framework/observable.js';
import { getFilms } from '../mock/films';

const EXTRA_FILMS_COUNT = 2;
export default class FilmsModel extends Observable {

  #films = getFilms();

  get films() {
    return this.#films;
  }

  updateFilm = (updateType, update) => {
    this.#films = this.#films.map((item) => item.id === update.id ? update : item);

    this._notify(updateType, update);
  };

  getFilmById = (filmId) => this.#films.find((item) => item.id === filmId);

  deleteComment = (film, idComment) => {

    // const indexComment = film.comments.findIndex((commentItem) => commentItem === idComment);
    // if (indexComment === -1) {
    //   throw new Error('Can\'t delete unexisting comment');
    // }
    film.comments = film.comments.filter((item) => item !== idComment);
  };

  addComment = (film, idComment) => {
    film.comments.push(idComment);
  };

  getWatchList = () => this.#films.filter((film) => film.userDetails.watchList);

  getAlreadyWatchedList = () => this.#films.filter((film) => film.userDetails.alreadyWatched);

  getFavoriteList = () => this.#films.filter((film) => film.userDetails.favorite);

  getMostCommented = () => this.#films.slice().sort((filmA, filmB) => filmB.comments.length - filmA.comments.length).slice(0, EXTRA_FILMS_COUNT);

  getMostRated = () => this.getSortRated().slice(0, EXTRA_FILMS_COUNT);

  getSortRated = () => this.#films.slice().sort((filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating);
}
