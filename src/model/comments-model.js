import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class CommentsModel extends Observable {

  #commentsApiService = null;
  #comments = [];

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;

  }

  init = async (idFilm) => {
    try {
      this.#commentsApiService.init(idFilm);
      this.#comments = await this.#commentsApiService.comments;
    } catch (err) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT_COMMENT);
  };

  get comments() {
    return this.#comments;
  }

  deleteComment = async (updateType, update) => {
    try {
      await this.#commentsApiService.deleteComment(update.comment.id);

      this.#comments = this.#comments.filter((item) => item.id !== update.comment.id);

      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  };

  addComment = async (updateType, update) => {
    try {
      const response = await this.#commentsApiService.addComment(update.film.id, update.comment);
      this.#comments = response.comments;
      update.film.comments = response.movie.comments;
      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  };
}
