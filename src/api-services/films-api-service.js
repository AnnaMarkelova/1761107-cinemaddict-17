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
      //body: JSON.stringify(film),
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
        actors: film.film_info.actors,
        'age_rating': film.film_info['ageRating'],
        'alternative_title': film.film_info.alternativeTitle,
        description: film.film_info['description'],
        director: film.film_info['director'],
        genre: film.film_info['genre'],
        poster: film.film_info['poster'],
        runtime: film.film_info['runtime'],
        title: film.film_info['title'],
        'total_rating': film.film_info.totalRating,
        release: {
          date: film.film_info.release['date'],
          'release_country': film.film_info.release.releaseCountry,
        },
      },
      'user_details': {
        'already_watched': film.user_details.alreadyWatched,
        favorite: film.user_details['favorite'],
        'watching_date': film.user_details.watchingDate,
        watchlist: film.user_details['watchlist'],
      }
    };

    // Ненужные ключи мы удаляем
    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;

    return adaptedFilm;
  };

}
