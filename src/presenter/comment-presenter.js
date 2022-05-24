import { render } from '../framework/render.js';
import CommentView from '../view/comment-view.js';

export default class CommentPresenter {

  #comment;
  #commentComponent;
  #container;

  constructor(comment, container) {
    this.#container = container;
    this.#comment = comment;
  }

  init = () => {
    this.#commentComponent = new CommentView(this.#comment);
    this.#renderComment();
  };

  #renderComment = () => {
    render(this.#commentComponent, this.#container.element);
  };

}
