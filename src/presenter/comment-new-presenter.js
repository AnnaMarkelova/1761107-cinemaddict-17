import { render } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import CommentNewView from '../view/comment-new-view.js';

export default class FilmDetailPresenter {

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

    this.#commentNewComponent = new CommentNewView();
    this.#renderCommentNew();
    this.#setupCommentHandlers();
  };

  #renderCommentNew = () => {
    render(this.#commentNewComponent, this.#container.element);
  };

  getFilmDetailComponent = () => this.#commentNewComponent;

  #setupCommentHandlers = () => {
    this.#commentNewComponent.setClickHandler(this.#handlerClick);
  };

  #handlerClick = () => {
    this.#updateComments(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      {
        film: this.#film,
        comment: this.#commentNewComponent.parseStateToComment(),
        isDelete: false
      },
    );
  };
}

