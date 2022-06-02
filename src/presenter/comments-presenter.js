import { render } from '../framework/render.js';
import CommentPresenter from './comment-presenter.js';
import CommentsView from '../view/comments-view.js';

export default class CommentsPresenter {

  #comments;
  #commentsComponent;
  #container;
  #film;
  #updateComments;

  #commentPresenterMap = new Map();

  constructor(comments, film, container, updateComments) {
    this.#container = container;
    this.#comments = comments;
    this.#updateComments = updateComments;
    this.#film = film;
  }

  init = () => {
    this.#commentsComponent = new CommentsView(this.#comments);
    this.#renderComments();
  };

  #renderComments = () => {
    render(this.#commentsComponent, this.#container.element);
    this.#comments.forEach((commentItem) => this.#renderComment(commentItem));
  };

  #renderComment = (commentItem) => {
    const commentPresenter = new CommentPresenter(commentItem, this.#film, this.#commentsComponent, this.#updateComments);
    commentPresenter.init(commentItem);
    this.#commentPresenterMap.set(commentItem.id, commentPresenter);
  };

}
