import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDateComment } from '../util/util.js';

const createCommentTemplate = (commentItem) => {

  const {
    author,
    comment,
    date,
    emotion,
  } = commentItem;

  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-sleeping">
  </span>
  <div>
    <p class="film-details__comment-text">${comment}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${humanizeDateComment(date)}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
  </li>`;

};

export default class CommentView extends AbstractView {
  #comment;

  constructor(comment) {
    super();
    this.#comment = comment;
  }

  get template() {
    return createCommentTemplate(this.#comment);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__comment-delete').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
