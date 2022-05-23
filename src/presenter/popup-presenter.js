import { isEscapeEvent } from '../util/util.js';
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

  #changeData = null;
  #commentsModel = null;
  #film = null;
  #popupComponent = null;
  #container = footerElement;

  #commentsPresenter;
  #commentsNewPresenter;
  #filmDetailPresenter;

  constructor(changeData) {
    this.#changeData = changeData;
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
      this.#setupFilmUserDetailHandlers();
      this.#setupCloseHandlers();
      return;
    }

    if (bodyElement.contains(prevPopupComponent.element)) {
      this.#renderFilmDetails();
      this.#renderComments();
      replace(this.#popupComponent, prevPopupComponent);
      this.#setupFilmUserDetailHandlers();
      this.#setupCloseHandlers();
    }

    remove(prevPopupComponent);

  };

  #renderPopup = () => {
    render(this.#popupComponent, this.#container, 'afterend');
  };

  #getFilmComments = () => this.#film.comments.map((item) => this.#commentsModel.getCommentById(item));

  #renderFilmDetails = () => {
    this.#filmDetailPresenter = new FilmDetailPresenter(this.#film, this.#popupComponent);
    this.#filmDetailPresenter.init();
  };

  #renderComments = () => {
    this.commentsContainerComponent = new CommentsContainerView();
    render(this.commentsContainerComponent, this.#popupComponent.element);
    this.commentsSectionComponent = new CommentsSectionView();
    render(this.commentsSectionComponent, this.commentsContainerComponent.element);
    render(new CommentsTitleView(this.#commentsModel.comments), this.commentsSectionComponent.element);

    this.#commentsPresenter = new CommentsPresenter(this.#getFilmComments(), this.commentsSectionComponent);
    this.#commentsPresenter.init();

    this.#commentsNewPresenter = new CommentsNewPresenter(this.commentsSectionComponent);
    this.#commentsNewPresenter.init();
  };

  closePopup = () => {
    remove(this.#popupComponent);
    this.#popupComponent = null;
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    //clear input and object
  };

  #setupCloseHandlers = () => {
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#filmDetailPresenter.getFilmDetailComponent().setClickHandler(this.#onFilmDetailsCloseBtnClick);
  };

  #setupFilmUserDetailHandlers = () => {
    const filmDetailComponent = this.#filmDetailPresenter.getFilmDetailComponent();
    filmDetailComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    filmDetailComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    filmDetailComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
  };

  #handleWatchlistClick = () => {
    this.#changeUserDetail('watchList');
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeUserDetail('alreadyWatched');
  };

  #handleFavoriteClick = () => {
    this.#changeUserDetail('favorite');
  };

  #changeUserDetail = (userDetail) => {
    this.#film.userDetails[userDetail] = !this.#film.userDetails[userDetail];
    this.#changeData({ ...this.#film });
  };

  #onFilmDetailsCloseBtnClick = () => {
    this.closePopup();
  };

  #onEscKeyDown = (evt) => {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this.closePopup();
    }
  };

}
