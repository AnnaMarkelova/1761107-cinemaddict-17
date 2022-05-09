import { render } from '../render.js';
import { isEscapeEvent } from '../util.js';
import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';

const footerElement = document.querySelector('.footer');

export default class FilmPresenter {

  #film;
  #container;
  #commentsModel;
  #filmCardComponent;
  #popupComponent;

  constructor(commentsModel, film, container) {
    this.#commentsModel = commentsModel;
    this.#film = film;
    this.#container = container;
  }

  init = () => {
    this.#renderFilm();
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
    this.#popupComponent.element.remove();
    this.#popupComponent.removeElement();
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

}
