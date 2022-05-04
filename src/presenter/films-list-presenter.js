import { render } from '../render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import PopupView from '../view/popup-view.js';

const footerElement = document.querySelector('.footer');

export default class FilmListPresenter {
  #filmListContainer;
  #filmsModel;
  #films;
  #commentsModel;

  #filmsComponent = new FilmsView();
  #filmsListComponent = new FilmsListView('All movies. Upcoming', true);
  #filmsListContainerComponent = new FilmsListContainerView();

  #filmsListTopRatedComponent = new FilmsListView('Top rated', false, true);
  #filmsListContainerTopRatedComponent = new FilmsListContainerView();

  #filmsListMostCommentedComponent = new FilmsListView('Most commented', false, true);
  #filmsListContainerMostCommentedComponent = new FilmsListContainerView();

  init = (filmListContainer, filmsModel, commentsModel) => {
    this.#filmListContainer = filmListContainer;
    this.#filmsModel = filmsModel;
    this.#films = [...this.#filmsModel.films];
    this.#commentsModel = commentsModel;

    render(this.#filmsComponent, this.#filmListContainer);
    render(this.#filmsListComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    for (let i = 0; i < this.#films.length; i++) {
      this.#renderFilm(this.#films[i], this.#filmsListContainerComponent.element);
    }

    render(new ShowMoreButtonView(), this.#filmsListComponent.element);

    render(this.#filmsListTopRatedComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerTopRatedComponent, this.#filmsListTopRatedComponent.element);

    for (let i = 0; i < 2; i++) {
      this.#renderFilm(this.#films[i], this.#filmsListContainerTopRatedComponent.element);
    }

    render(this.#filmsListMostCommentedComponent, this.#filmsComponent.element);
    render(this.#filmsListContainerMostCommentedComponent, this.#filmsListMostCommentedComponent.element);

    for (let i = 0; i < 2; i++) {
      this.#renderFilm(this.#films[i], this.#filmsListContainerMostCommentedComponent.element);
    }
  };

  #renderFilm = (film, container) => {

    let popupComponent = null;

    const filmCardComponent = new FilmCardView(film);
    render(filmCardComponent, container);

    const getFilmComments = () => {
      const filmComments = [];
      film.comments.forEach((item) => {
        filmComments.push(this.#commentsModel.getCommentById(item));
      });
      return filmComments;
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        popupComponent.element.remove();
        popupComponent.removeElement();
        document.body.classList.remove('hide-overflow');
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const onFilmDetailsCloseBtnClick = () => {
      popupComponent.element.remove();
      popupComponent.removeElement();
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscKeyDown);
    };

    const onFilmCardClick = (evt) => {
      if (evt.target.closest('.film-card__link')) {
        popupComponent = new PopupView(film, getFilmComments());
        render(popupComponent, footerElement, 'afterend');
        popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', onFilmDetailsCloseBtnClick);
      }
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', onEscKeyDown);
    };

    filmCardComponent.element.querySelector('.film-card__link').addEventListener('click', onFilmCardClick);
  };

}
