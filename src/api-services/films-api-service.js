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

    const adaptedFilm = {
      ...film,
      'film_info': {
        actors: film.filmInfo.actors,
        'age_rating': film.filmInfo['ageRating'],
        'alternative_title': film.filmInfo.alternativeTitle,
        description: film.filmInfo['description'],
        director: film.filmInfo['director'],
        genre: film.filmInfo['genre'],
        poster: film.filmInfo['poster'],
        runtime: film.filmInfo['runtime'],
        title: film.filmInfo['title'],
        'total_rating': film.filmInfo.totalRating,
        writers:  film.filmInfo.writers,
        release: {
          date: film.filmInfo.release['date'],
          'release_country': film.filmInfo.release.releaseCountry,
        },
      },
      'user_details': {
        'already_watched': film.userDetails.alreadyWatched,
        favorite: film.userDetails['favorite'],
        'watching_date': film.userDetails.watchingDate,
        watchlist: film.userDetails['watchlist'],
      }
    };

    // Ненужные ключи мы удаляем
    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;

    return adaptedFilm;
  };

}
