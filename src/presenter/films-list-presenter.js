import { render } from '../render.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

export default class FilmListPresenter {

  filmsComponent = new FilmsView();
  filmsListComponent = new FilmsListView('', '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>');
  filmsListContainerComponent = new FilmsListContainerView();

  filmsListTopRatedComponent = new FilmsListView('films-list--extra', '<h2 class="films-list__title">Top rated</h2>');
  filmsListContainerTopRatedComponent = new FilmsListContainerView();

  filmsListMostCommentedComponent = new FilmsListView('films-list--extra', '<h2 class="films-list__title">Most commented</h2>');
  filmsListContainerMostCommentedComponent = new FilmsListContainerView();

  init = (filmListContainer, filmsModel) => {
    this.filmListContainer = filmListContainer;
    this.filmsModel = filmsModel;
    this.films =  [...filmsModel.getFilms()];

    render(this.filmsComponent, this.filmListContainer);
    render(this.filmsListComponent, this.filmsComponent.getElement());
    render(this.filmsListContainerComponent, this.filmsListComponent.getElement());

    for (let i = 0; i < this.films.length; i++) {
      render(new FilmCardView(this.films[i].film), this.filmsListContainerComponent.getElement());
    }

    render(new ShowMoreButtonView(), this.filmsListComponent.getElement());

    render(this.filmsListTopRatedComponent, this.filmsComponent.getElement());
    render(this.filmsListContainerTopRatedComponent, this.filmsListTopRatedComponent.getElement());

    for (let i = 0; i < 2; i++) {
      render(new FilmCardView(this.films[i].film), this.filmsListContainerTopRatedComponent.getElement());
    }

    render(this.filmsListMostCommentedComponent, this.filmsComponent.getElement());
    render(this.filmsListContainerMostCommentedComponent, this.filmsListMostCommentedComponent.getElement());

    for (let i = 0; i < 2; i++) {
      render(new FilmCardView(this.films[i].film), this.filmsListContainerMostCommentedComponent.getElement());
    }

  };
}