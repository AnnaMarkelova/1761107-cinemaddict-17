import { render, remove } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import CommentNewView from '../view/comment-new-view.js';

export default class CommentNewPresenter {

  #container;
  #commentNewComponent = null;
  #film;
  #updateComments;

  constructor(updateComments) {
    this.#updateComments = updateComments;
  }

  init = (container, film, restoreComment) => {

    this.#container = container;
    this.#film = film;

    const prevCommentNewComponent = this.#commentNewComponent;
    if (restoreComment && prevCommentNewComponent !== null) {
      this.#commentNewComponent = new CommentNewView(this.#handlerKeydown, prevCommentNewComponent.state);
    } else {
      this.#commentNewComponent = new CommentNewView(this.#handlerKeydown);
    }
    this.#renderCommentNew();
    remove(prevCommentNewComponent);

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
        setAborting: this.#setAborting,
      },
    );
  };

  #setSaving = () => {
    this.#commentNewComponent.updateElement({
      isDisabled: true,
    });
  };

  #setAborting = () => {
    const resetFormState = () => {
      this.#commentNewComponent.updateElement({
        isDisabled: false,
      });
    };

    this.#commentNewComponent.shake(resetFormState);
  };
}

