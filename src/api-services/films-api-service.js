import ApiService from '../framework/api-service.js';
import { Method } from '../const.js';

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({ url: 'movies' })
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (film) => {

    const {
      filmInfo,
      userDetails,
      ...filmProps } = film;

    const adaptedFilm = {
      'film_info': this.#getFilmInfo(filmInfo),
      'user_details': this.#getUserDetails(userDetails),
      ...filmProps
    };

    return adaptedFilm;
  };

  #getFilmInfo = (filmInfo) => {
    const {
      ageRating,
      alternativeTitle,
      totalRating,
      release: {
        releaseCountry,
        ...restReleaseProps
      },
      ...restFilmInfoProp
    } = filmInfo;

    return {
      'age_rating': ageRating,
      'alternative_title': alternativeTitle,
      'total_rating': totalRating,
      release: {
        'release_country': releaseCountry,
        ...restReleaseProps
      },
      ...restFilmInfoProp,
    };
  };

  #getUserDetails = (userDetails) => {
    const {
      alreadyWatched,
      watchingDate,
      ...restUserDetailProps
    } = userDetails;

    return {
      'already_watched': alreadyWatched,
      'watching_date': watchingDate,
      ...restUserDetailProps
    };
  };

}
