import AbstractView from '../framework/view/abstract-view.js';

const createCommentsTemplate = (commentsList) =>
  `<h3 class="film-details__comments-title">Comments
    <span class="film-details__comments-count">${commentsList.length}</span>
  </h3>`;

export default class CommentsTitleView extends AbstractView {
  #comments;

  constructor(comments) {
    super();
    this.#comments = comments;
  }

  get template() {
    return createCommentsTemplate(this.#comments);
  }

}
