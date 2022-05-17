import { render, remove } from '../framework/render.js';
import { isEscapeEvent } from '../util/util.js';
import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';

const footerElement = document.querySelector('.footer');

export default class FilmPresenter {

  #film = null;
  #container;
  #commentsModel = null;
  #filmCardComponent = null;
  #popupComponent = null;

  constructor(container) {
    this.#container = container;
  }

  init = (film, commentsModel) => {
    this.#film = film;
    this.#commentsModel = commentsModel;

    const prevFilmCardComponent = this.#filmCardComponent;

    if (prevFilmCardComponent === null) {
      this.#renderFilm();
    }

    remove(prevFilmCardComponent);
  };

  #renderFilm = () => {
    this.#filmCardComponent = new FilmCardView(this.#film);
    render(this.#filmCardComponent, this.#container);
    this.#filmCardComponent.setClickHandler(this.#onFilmCardClick);
  };

  #getFilmComments = () => {
    const filmComments = [];
    this.#film.comments.forEach((item) => {
      filmComments.push(this.#commentsModel.getCommentById(item));
    });
    return filmComments;
  };

  #closePopup = () => {
    remove(this.#popupComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt) => {
    if (isEscapeEvent(evt)) {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  #onFilmDetailsCloseBtnClick = () => {
    this.#closePopup();
  };

  #onFilmCardClick = () => {
    this.#popupComponent = new PopupView(this.#film, this.#getFilmComments());
    render(this.#popupComponent, footerElement, 'afterend');
    this.#popupComponent.setClickHandler(this.#onFilmDetailsCloseBtnClick);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#popupComponent);
  };

}
