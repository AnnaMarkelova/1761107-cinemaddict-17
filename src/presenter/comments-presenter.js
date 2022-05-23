import { render } from '../framework/render.js';
import CommentPresenter from './comment-presenter.js';
import CommentsView from '../view/comments-view.js';

export default class CommentsPresenter {

  #comments;
  #commentsComponent;
  #container;

  #commentPresenterMap = new Map();

  constructor(comments, container) {
    this.#container = container;
    this.#comments = comments;
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
    const commentPresenter = new CommentPresenter(commentItem, this.#commentsComponent);
    commentPresenter.init(commentItem);
    this.#commentPresenterMap.set(commentItem.id, commentPresenter);
  };

}
