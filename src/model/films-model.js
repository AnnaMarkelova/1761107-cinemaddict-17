import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

const EXTRA_FILMS_COUNT = 2;
export default class FilmsModel extends Observable {

  #filmsApiService = null;
  #films = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT_FILM);
  };

  get films() {
    return this.#films;
  }

  #adaptToClient = (film) => {

    const adaptedFilm = {
      ...film,
      filmInfo: {
        actors: film.film_info['actors'],
        ageRating: film.film_info['age_rating'],
        alternativeTitle: film.film_info['alternative_title'],
        description: film.film_info['description'],
        director: film.film_info['director'],
        genre: film.film_info['genre'],
        poster: film.film_info['poster'],
        runtime: film.film_info['runtime'],
        title: film.film_info['title'],
        totalRating: film.film_info['total_rating'],
        writers:  film.film_info['writers'],
        release: {
          date: film.film_info.release['date'],
          releaseCountry: film.film_info.release['release_country'],
        },
      },
      userDetails: {
        alreadyWatched: film.user_details['already_watched'],
        favorite: film.user_details['favorite'],
        watchingDate: film.user_details['watching_date'],
        watchlist: film.user_details['watchlist'],
      }
    };

    // Ненужные ключи мы удаляем
    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  };


  updateFilm = async (updateType, update) => {
    try {
      const response = await this.#filmsApiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);

      this.#films = this.#films.map((item) => item.id === updatedFilm.id ? updatedFilm : item);

      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  };

  getFilmById = (filmId) => this.#films.find((item) => item.id === filmId);

  deleteComment = (film, idComment) => {
    film.comments = film.comments.filter((item) => item !== idComment);
  };

  addComment = (film, idComment) => {
    film.comments.push(idComment);
  };

  getWatchList = () => this.#films.filter((film) => film.userDetails.watchlist);

  getAlreadyWatchedList = () => this.#films.filter((film) => film.userDetails.alreadyWatched);

  getFavoriteList = () => this.#films.filter((film) => film.userDetails.favorite);

  getMostCommented = () => this.#films.slice().sort((filmA, filmB) => filmB.comments.length - filmA.comments.length).slice(0, EXTRA_FILMS_COUNT);

  getMostRated = () => this.getSortRated().slice(0, EXTRA_FILMS_COUNT);

  getSortRated = () => this.#films.slice().sort((filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating);
}
