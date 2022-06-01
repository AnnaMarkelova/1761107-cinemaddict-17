import { render, remove, replace } from '../framework/render.js';
import CommentsContainerView from '../view/comments-container-view.js';
import CommentsSectionView from '../view/comments-section-view.js';
import CommentsTitleView from '../view/comments-title-view.js';
import CommentsPresenter from './comments-presenter.js';
import CommentsNewPresenter from './comment-new-presenter.js';
import FilmDetailPresenter from './film-details-presenter.js';
import PopupView from '../view/popup-view.js';

const footerElement = document.querySelector('.footer');
const bodyElement = document.querySelector('body');
export default class PopupPresenter {

  #updateData = null;
  #commentsModel = null;
  #film = null;
  #popupComponent = null;
  #container = footerElement;

  #commentsPresenter;
  #commentsNewPresenter;
  #filmDetailPresenter;

  constructor(updateData) {
    this.#updateData = updateData;
  }

  init = (film, commentsModel) => {
    this.#film = film;
    this.#commentsModel = commentsModel;

    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView();

    if (prevPopupComponent === null) {
      this.#renderPopup();
      this.#renderFilmDetails();
      this.#renderComments();
      return;
    }

    if (bodyElement.contains(prevPopupComponent.element)) {
      this.#renderFilmDetails();
      this.#renderComments();
      replace(this.#popupComponent, prevPopupComponent);

    }
    remove(prevPopupComponent);
  };

  #renderPopup = () => {
    render(this.#popupComponent, this.#container, 'afterend');
  };

  #getFilmComments = () => this.#film.comments.map((item) => this.#commentsModel.getCommentById(item));

  #renderFilmDetails = () => {
    this.#filmDetailPresenter = new FilmDetailPresenter(this.#film, this.#popupComponent, this.#updateData, this.#closePopup);
    this.#filmDetailPresenter.init();
  };

  #renderComments = () => {
    this.commentsContainerComponent = new CommentsContainerView();
    render(this.commentsContainerComponent, this.#popupComponent.element);
    this.commentsSectionComponent = new CommentsSectionView();
    render(this.commentsSectionComponent, this.commentsContainerComponent.element);
    render(new CommentsTitleView(this.#commentsModel.getCommentsOfFilm(this.#film.comments)), this.commentsSectionComponent.element);

    this.#commentsPresenter = new CommentsPresenter(this.#getFilmComments(), this.commentsSectionComponent, this.#updateData);
    this.#commentsPresenter.init();

    this.#commentsNewPresenter = new CommentsNewPresenter(this.commentsSectionComponent);
    this.#commentsNewPresenter.init();
  };

  #closePopup = () => {
    remove(this.#popupComponent);
    this.#popupComponent = null;
  };

}
