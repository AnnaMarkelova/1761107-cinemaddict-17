import { render } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import CommentNewView from '../view/comment-new-view.js';

export default class CommentNewPresenter {

  #container;
  #commentNewComponent;
  #film;
  #updateComments;

  constructor(container, film, updateComments) {
    this.#container = container;
    this.#updateComments = updateComments;
    this.#film = film;
  }

  init = () => {

    this.#commentNewComponent = new CommentNewView(this.#handlerKeydown);
    this.#renderCommentNew();
  };

  #renderCommentNew = () => {
    render(this.#commentNewComponent, this.#container.element);
  };

  #handlerKeydown = (newComment) => {
    this.#updateComments(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      {
        film: this.#film,
        comment: newComment,
        isDelete: false,
        setViewAction: this.#setSaving,
      },
    );
  };

  #setSaving = () => {
    this.#commentNewComponent.updateElement({
      isDisabled: true,
    });
  };
}

