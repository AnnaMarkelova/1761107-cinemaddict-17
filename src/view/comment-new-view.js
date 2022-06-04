import { EMOTIONS } from '../const.js';
import { isCtrlEnterEvent, isCommandEnterEvent } from '../util/util.js';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const BLANK_COMMENT = {
  id: '',
  author: '',
  comment: '',
  date: null,
  emotion: '',
};

const createEmotion = (emotion) => `
  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
  <label class="film-details__emoji-label" for="emoji-${emotion}">
    <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
  </label>`;

const createPopupTemplate = (state) => {

  const emotion = state.emotion ? `<img src="images/emoji/${state.emotion}.png" width="55" height="55" alt="emoji-${state.emotion}">` : '';

  const emojiList = EMOTIONS.map((emotionItem) => createEmotion(emotionItem)).join('');
  return `<div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">${emotion}</div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${state.comment}</textarea>
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

  constructor(handlerKeydown) {
    super();
    this.#comment = BLANK_COMMENT;
    this.#handlerKeydown = handlerKeydown;
    this._state = CommentNewView.parseCommentToState(this.#comment);
    this.#setInnerHandlers();
    this.#setKeydownHandler();
  }

  get template() {
    return createPopupTemplate(this._state);
  }

  static parseCommentToState = (comment) => ({ ...comment });

  static parseStateToComment = (state) => {
    const comment = { ...state };
    comment.id = nanoid();
    comment.author = 'Ilya OReilly';
    comment.date = dayjs().toISOString();
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
