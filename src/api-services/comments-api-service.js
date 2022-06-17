import ApiService from '../framework/api-service.js';
import { Method } from '../const.js';

export default class CommentsApiService extends ApiService {
  #idFilm = '';

  init(idFilm) {
    this.#idFilm = idFilm;
  }

  get comments() {
    return this._load({ url: `comments/${this.#idFilm}` })
      .then(ApiService.parseResponse);
  }

  deleteComment = async (commentId) => {
    const response = await this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });
    return response;
  };

  addComment = async (filmId, comment) => {
    const response = await this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };
}
