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
    } catch (err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT_FILM);
  };

  get films() {
    return this.#films;
  }

  #adaptToClient = (film) => {

    const {
      film_info: filmInfoProps,
      user_details: userDetailsProps,
      ...filmProps } = film;

    const adaptedFilm = {
      filmInfo: this.#getFilmInfo(filmInfoProps),
      userDetails: this.#getUserDetails(userDetailsProps),
      ...filmProps
    };

    return adaptedFilm;
  };

  #getFilmInfo = (filmInfo) => {
    const {
      age_rating: ageRating,
      alternative_title: alternativeTitle,
      total_rating: totalRating,
      release: {
        release_country: releaseCountry,
        ...restReleaseProps
      },
      ...restFilmInfoProp
    } = filmInfo;

    return {
      ageRating,
      alternativeTitle,
      totalRating,
      release: {
        releaseCountry,
        ...restReleaseProps
      },
      ...restFilmInfoProp,
    };
  };

  #getUserDetails = (userDetails) => {
    const {
      already_watched: alreadyWatched,
      watching_date: watchingDate,
      ...restUserDetailProps
    } = userDetails;

    return {
      alreadyWatched,
      watchingDate,
      ...restUserDetailProps
    };
  };

  updateFilm = async (updateType, update) => {
    try {
      const response = await this.#filmsApiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);

      this.#films = this.#films.map((item) => item.id === updatedFilm.id ? updatedFilm : item);

      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t update film');
    }
  };

  deleteComment = (film, idComment) => {
    film.comments = film.comments.filter((item) => item !== idComment);
  };

  getWatchList = () => this.#films.filter((film) => film.userDetails.watchlist);

  getAlreadyWatchedList = () => this.#films.filter((film) => film.userDetails.alreadyWatched);

  getFavoriteList = () => this.#films.filter((film) => film.userDetails.favorite);

  getMostCommented = () => this.#films.slice().sort((filmA, filmB) => filmB.comments.length - filmA.comments.length).
    slice(0, EXTRA_FILMS_COUNT).filter((film) => film.comments.length > 0);

  getMostRated = () => this.getSortRated().slice(0, EXTRA_FILMS_COUNT);

  getSortRated = () => this.#films.filter((film) => film.filmInfo.totalRating > 0).sort((filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating);
}
