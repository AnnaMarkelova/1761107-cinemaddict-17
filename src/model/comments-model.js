import Observable from '../framework/observable.js';
import { getComments } from '../mock/comments';

export default class CommentsModel extends Observable {

  #comments = getComments();

  get comments() {
    return this.#comments;
  }

  deleteComment = (updateType, update) => {
    // const index = this.#comments.findIndex((comment) => comment.id === update.id);

    // if (index === -1) {
    //   throw new Error('Can\'t delete unexisting comment');
    // }

    this.#comments = this.#comments.filter((item) => item.id !== update.comment.id);

    this._notify(updateType, update);
  };

  addComment = (updateType, update) => {
    this.#comments.push(update.comment);

    this._notify(updateType, update);
  };

  getCommentsOfFilm = (commentsID) => this.#comments.filter((comment) => commentsID.includes(comment.id));

  getCommentById = (id) => this.#comments.find((comment) => comment.id === id);
}
