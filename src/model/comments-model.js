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
    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT_COMMENT);
  };

  get comments() {
    return this.#comments;
  }

  deleteComment = (updateType, update) => {
    this.#comments = this.#comments.filter((item) => item.id !== update.comment.id);

    this._notify(updateType, update);
  };

  addComment = (updateType, update) => {
    this.#comments.push(update.comment);

    this._notify(updateType, update);
  };
}
