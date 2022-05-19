import { render } from '../framework/render.js';
import {updateItem} from '../util/util.js';
import { generateFilter } from '../mock/filter.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmListPresenter from './films-list-presenter.js';
import SortView from '../view/sort-view.js';
import StatisticsView from '../view/statistics-view.js';
import MainNavigationView from '../view/main-navigation-view.js';
import ProfileView from '../view/profile-view.js';

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');

export default class PagePresenter {

  #commentsModel;
  #films;
  #filmsComponent = new FilmsView;
  #filmsModel;
  #filmsListMostCommentedPresenter;
  #filmsListComponent = new FilmsListView;
  #filmListContainer;
  #filmListPresenter;
  #filmsListTopRatedPresenter;

  #filmListPresenters = [];

  constructor(filmListContainer, filmsModel, commentsModel) {
    this.#filmListContainer = filmListContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.films];

    this.#renderMainNavigation();
    this.#renderProfileView();
    this.#renderFilmsBoard();
    this.#renderStatistic();
  };

  #renderFilmsBoard = () => {

    if (!this.#films.length) {
      this.#renderNoFilms();
    } else {
      this.#renderSorts();
      this.#renderFilmsList();
    }

  };

  #renderMainNavigation = () => {
    const filters = generateFilter(this.#filmsModel);
    render(new MainNavigationView(filters), mainElement);
  };

  #renderProfileView = () => {
    render(new ProfileView(), headerElement);
  };

  #renderNoFilms = () => {
    this.#filmsListComponent.init('There are no movies in our database', false);
    render(this.#filmsListComponent, this.#filmsComponent.element);
  };

  #renderSorts = () => {
    render(new SortView, this.#filmListContainer);
  };

  #renderFilmsList = () => {
    render(this.#filmsComponent, this.#filmListContainer);
    this.#filmListPresenter = new FilmListPresenter(
      this.#filmsComponent,
      this.#filmsModel.films,
      this.#commentsModel,
      this.#handleFilmChange,
      this.#handleDeletePopups,
      'All movies. Upcoming',
      true,
      false
    );
    this.#filmListPresenter.init();
    this.#filmListPresenters.push(this.#filmListPresenter);

    this.#filmsListTopRatedPresenter = new FilmListPresenter(
      this.#filmsComponent,
      this.#filmsModel.getMostRated(),
      this.#commentsModel,
      this.#handleFilmChange,
      this.#handleDeletePopups,
      'Top rated',
      false,
      true
    );
    this.#filmsListTopRatedPresenter.init();
    this.#filmListPresenters.push(this.#filmsListTopRatedPresenter);

    this.#filmsListMostCommentedPresenter = new FilmListPresenter(
      this.#filmsComponent,
      this.#filmsModel.getMostCommented(),
      this.#commentsModel,
      this.#handleFilmChange,
      this.#handleDeletePopups,
      'Most commented',
      false,
      true
    );
    this.#filmsListMostCommentedPresenter.init();
    this.#filmListPresenters.push(this.#filmsListMostCommentedPresenter);
  };

  #renderStatistic = () => {
    render(new StatisticsView(this.#films.length), footerElement);
  };

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);

    this.#filmListPresenters.forEach((presenter) => {
      this.#updateFilmList(presenter, updatedFilm);
    });

  };

  #updateFilmList = (filmListPresenter, updatedFilm) => {
    const filmPresenterMap = filmListPresenter.getFilmPresenterMap();
    if (filmPresenterMap.has(updatedFilm.id)) {
      filmPresenterMap.get(updatedFilm.id).init(updatedFilm, this.#commentsModel);
    }
  };

  #handleDeletePopups = () => {
    this.#filmListPresenters.forEach((presenter) => {
      presenter.getFilmPresenterMap().forEach((filmPresenter) => filmPresenter.deletePopup());
    });
  };

}
