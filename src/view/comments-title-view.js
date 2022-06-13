import AbstractView from '../framework/view/abstract-view.js';

const createCommentsTemplate = (commentsCount) =>
  `<h3 class="film-details__comments-title">Comments
    <span class="film-details__comments-count">${commentsCount}</span>
  </h3>`;

export default class CommentsTitleView extends AbstractView {
  #commentsCount;

  constructor(commentsCount) {
    super();
    this.#commentsCount = commentsCount;
  }

  get template() {
    return createCommentsTemplate(this.#commentsCount);
  }

}
