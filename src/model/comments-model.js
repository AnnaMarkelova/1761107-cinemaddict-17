import { getComments } from '../mock/comments';

export default class CommentsModel {

  #comments = getComments();

  get comments () {
    return this.#comments;
  }

  getCommentById = (id) => this.#comments.find((comment) => comment.id === id);
}
