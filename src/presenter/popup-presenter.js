import { render, remove, replace } from '../framework/render.js';
import { UpdateType } from '../const.js';

import CommentsContainerView from '../view/comments-container-view.js';
import CommentsSectionView from '../view/comments-section-view.js';
import CommentsTitleView from '../view/comments-title-view.js';
import PopupView from '../view/popup-view.js';

import CommentsPresenter from './comments-presenter.js';
import CommentNewPresenter from './comment-new-presenter.js';
import FilmDetailPresenter from './film-details-presenter.js';

const footerElement = document.querySelector('.footer');
const bodyElement = document.querySelector('body');
export default class PopupPresenter {

  #updateData = null;
  #setCurrentFilmPopup = null;

  #commentsModel = null;

  #film = null;
  #restoreComment;

  #popupComponent = null;

  #container = footerElement;

  #commentsPresenter;
  #CommentNewPresenter = null;
  #filmDetailPresenter;

  constructor(commentsModel, updateData, setCurrentFilmPopup) {
    this.#updateData = updateData;
    this.#setCurrentFilmPopup = setCurrentFilmPopup;

    this.#commentsModel = commentsModel;
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  init = (film, restoreComment) => {
    this.#film = film;
    this.#restoreComment = restoreComment;
    this.#commentsModel.init(this.#film.id);
  };

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.INIT_COMMENT:
        this.#renderPopupBoard();
        break;
    }
  };

  #renderPopupBoard = () => {

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

  #renderFilmDetails = () => {
    this.#filmDetailPresenter = new FilmDetailPresenter(this.#film, this.#popupComponent, this.#updateData, this.#closePopup);
    this.#filmDetailPresenter.init();
  };

  #renderComments = () => {
    this.commentsContainerComponent = new CommentsContainerView();
    render(this.commentsContainerComponent, this.#popupComponent.element);
    this.commentsSectionComponent = new CommentsSectionView();
    render(this.commentsSectionComponent, this.commentsContainerComponent.element);
    render(new CommentsTitleView(this.#commentsModel.comments.length), this.commentsSectionComponent.element);

    this.#commentsPresenter = new CommentsPresenter(this.#commentsModel.comments, this.#film, this.commentsSectionComponent, this.#updateData);
    this.#commentsPresenter.init();

    if (this.#CommentNewPresenter === null) {
      this.#CommentNewPresenter = new CommentNewPresenter(this.#updateData);
    }
    this.#CommentNewPresenter.init(this.commentsSectionComponent, this.#film, this.#restoreComment );
  };

  #closePopup = () => {
    remove(this.#popupComponent);
    this.#popupComponent = null;
    this.#setCurrentFilmPopup(null);
  };

}
