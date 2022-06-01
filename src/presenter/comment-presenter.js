import { render } from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import CommentView from '../view/comment-view.js';

export default class CommentPresenter {

  #comment;
  #commentComponent;
  #container;
  #updateComments;

  constructor(comment, container, updateComments) {
    this.#container = container;
    this.#comment = comment;
    this.#updateComments = updateComments;
  }

  init = () => {
    this.#commentComponent = new CommentView(this.#comment);
    this.#renderComment();
    this.#setupCommentHandlers();
  };

  #renderComment = () => {
    render(this.#commentComponent, this.#container.element);
  };

  #setupCommentHandlers = () => {
    this.#commentComponent.setClickHandler(this.#handlerClick);
  };

  #handlerClick = () => {
    this.#updateComments(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      this.#comment,
    );
  };
}
