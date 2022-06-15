import { EMOTIONS } from '../const.js';
import { isCtrlEnterEvent, isCommandEnterEvent } from '../util/util.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const BLANK_COMMENT = {
  comment: '',
  emotion: '',
};

const createEmotion = (emotion, isDisabled) => `
  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}" ${isDisabled}>
  <label class="film-details__emoji-label" for="emoji-${emotion}">
    <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
  </label>`;

const createPopupTemplate = (state) => {

  const emotion = state.emotion ? `<img src="images/emoji/${state.emotion}.png" width="55" height="55" alt="emoji-${state.emotion}">` : '';
  const isDisabled = state.isDisabled ? 'disabled' : '';
  const emojiList = EMOTIONS.map((emotionItem) => createEmotion(emotionItem, isDisabled)).join('');
  return `<div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">${emotion}</div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled}>${state.comment}</textarea>
      </label>

      <div class="film-details__emoji-list">
      ${emojiList}
      </div>
    </div>`;
};


export default class CommentNewView extends AbstractStatefulView {

  #comment;
  #handlerKeydown;
  _state;

  constructor(handlerKeydown, prevState = BLANK_COMMENT) {
    super();
    this.#comment = prevState;
    this.#handlerKeydown = handlerKeydown;
    this._state = CommentNewView.parseCommentToState(this.#comment);
    this.#setInnerHandlers();
    this.#setKeydownHandler();
  }

  get template() {
    return createPopupTemplate(this._state);
  }

  get state() {
    return this._state;
  }

  static parseCommentToState = (comment) => (
    {
      ...comment,
      isDisabled: false,
    }
  );

  static parseStateToComment = (state) => {
    const comment = { ...state };
    delete comment.isDisabled;
    return comment;
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setKeydownHandler();
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#emojiListHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('change', this.#commentInputHandler);
  };

  #setKeydownHandler = () => {
    this._callback.click = this.#handlerKeydown;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#ctrlEnterKeyDownHandler);
  };

  #emojiListHandler = (evt) => {
    const emojiItemInput = evt.target.closest('.film-details__emoji-item');
    if (emojiItemInput) {
      evt.preventDefault();
      emojiItemInput.checked = true;
      this.updateElement({
        emotion: emojiItemInput.value,
      });
    }
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      comment: evt.target.value,
    });
  };

  #ctrlEnterKeyDownHandler = (evt) => {
    if (isCtrlEnterEvent(evt) || isCommandEnterEvent(evt)) {
      evt.preventDefault();
      this._callback.click(CommentNewView.parseStateToComment(this._state));
    }
  };

}
