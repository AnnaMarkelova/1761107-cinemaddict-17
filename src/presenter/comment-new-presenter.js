import { render } from '../framework/render.js';
import CommentNewView from '../view/comment-new-view.js';

export default class FilmDetailPresenter {

  #container;
  #commentNewComponent;

  constructor(container) {
    this.#container = container;
  }

  init = () => {

    this.#commentNewComponent = new CommentNewView();
    this.#renderCommentNew();
  };

  #renderCommentNew = () => {
    render(this.#commentNewComponent, this.#container.element);
  };

  getFilmDetailComponent = () => this.#commentNewComponent;

}

