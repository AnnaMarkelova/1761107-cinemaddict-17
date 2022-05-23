import AbstractView from '../framework/view/abstract-view.js';

const createCommentsTemplate = () => '<ul class="film-details__comments-list"></ul>';

export default class CommentsView extends AbstractView {

  get template() {
    return createCommentsTemplate();
  }

}
