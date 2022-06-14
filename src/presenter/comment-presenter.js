import { render } from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import CommentView from '../view/comment-view.js';

export default class CommentPresenter {

  #comment;
  #commentComponent;
  #container;
  #film;
  #updateComments;

  constructor(comment, film, container, updateComments) {
    this.#container = container;
    this.#comment = comment;
    this.#updateComments = updateComments;
    this.#film = film;
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
      UpdateType.MINOR,
      {
        film: this.#film,
        comment: this.#comment,
        isDelete: true,
        setViewAction: this.#setDeleting,
      },
    );
  };

  #setDeleting = () => {
    this.#commentComponent.updateElement({
      isDisabled: true,
      isDeleting: true,
    });
    this.#commentComponent.setClickHandler(this.#handlerClick);
  };
}
