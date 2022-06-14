import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDateComment } from '../util/util.js';

const createCommentTemplate = (commentItem, state) => {

  const {
    author,
    comment,
    date,
    emotion,
  } = commentItem;
  const isDisabled = state.isDisabled ? 'disabled' : '';
  const isDeleting = state.isDeleting ? 'deleting...' : 'Delete';

  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-sleeping">
  </span>
  <div>
    <p class="film-details__comment-text">${he.encode(comment)}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${humanizeDateComment(date)}</span>
      <button class="film-details__comment-delete" ${isDisabled}>${isDeleting}</button>
    </p>
  </div>
  </li>`;

};

export default class CommentView extends AbstractStatefulView {
  #comment;
  _state;

  constructor(comment) {
    super();
    this.#comment = comment;
    this._state = {
      isDisabled: false,
      isDeleting: false,
    };
  }

  _restoreHandlers = () => {
    //
  };

  get template() {
    return createCommentTemplate(this.#comment, this._state);
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
