import AbstractView from '../framework/view/abstract-view.js';

const createCommentsTemplate = () =>
  `<section class="film-details__comments-wrap">
    </section>`;

export default class CommentsSectionView extends AbstractView {

  get template() {
    return createCommentsTemplate();
  }

}
