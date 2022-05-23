import { render } from '../framework/render.js';
import FilmDetailsView from '../view/film-details-view.js';

export default class FilmDetailPresenter {

  #container;
  #film;
  #filmDetailComponent;

  constructor(film, container) {
    this.#container = container;
    this.#film = film;
  }

  init = () => {

    this.#filmDetailComponent = new FilmDetailsView(this.#film);
    this.#renderFilmDetail();
  };

  #renderFilmDetail = () => {
    render(this.#filmDetailComponent, this.#container.element);
  };

  getFilmDetailComponent = () => this.#filmDetailComponent;

}

