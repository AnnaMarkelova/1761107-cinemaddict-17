import AbstractView from '../framework/view/abstract-view.js';

const createCommentsTemplate = () =>
  `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
    </section>
  </div>`;

export default class CommentsContainerView extends AbstractView {

  get template() {
    return createCommentsTemplate();
  }

}
