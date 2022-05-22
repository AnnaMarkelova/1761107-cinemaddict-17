import { render } from '../framework/render.js';
import { updateItem } from '../util/util.js';
import { generateFilter } from '../mock/filter.js';
import { SortType } from '../const.js';
import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmListPresenter from './films-list-presenter.js';
import SortView from '../view/sort-view.js';
import StatisticsView from '../view/statistics-view.js';
import MainNavigationView from '../view/main-navigation-view.js';
import PopupPresenter from './popup-presenter.js';
import ProfileView from '../view/profile-view.js';

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');

export default class PagePresenter {

  #currentSortType = SortType.DEFAULT;
  #commentsModel;
  #films;
  #filmsComponent = new FilmsView;
  #filmsModel;
  #filmsListMostCommentedPresenter;
  #filmsListComponent = new FilmsListView;
  #filmListContainer;
  #filmListPresenter;
  #filmsListTopRatedPresenter;
  #popupPresenter;
  #sortComponent = new SortView;

  #filmListPresenters = [];

  #sorts = [
    {
      sortType: SortType.DEFAULT,
      sortFilms: () => this.#films,
    },
    {
      sortType: SortType.DATE,
      sortFilms: () => this.#filmsModel.getSortDateRelease(),
    },
    {
      sortType: SortType.RATING,
      sortFilms: () => this.#filmsModel.getSortRated(),
    },

  ];

  constructor(filmListContainer, filmsModel, commentsModel) {
    this.#filmListContainer = filmListContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#popupPresenter = new PopupPresenter(this.#handleFilmChange);
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
    render(this.#sortComponent, this.#filmListContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };


  #renderFilmsList = () => {
    render(this.#filmsComponent, this.#filmListContainer);
    this.#filmListPresenter = new FilmListPresenter(
      this.#filmsComponent,
      this.#handleFilmChange,
      this.#handleUpdatePopup,
      'All movies. Upcoming',
      true,
      false
    );
    this.#filmListPresenter.init(this.#filmsModel.films);
    this.#filmListPresenters.push(this.#filmListPresenter);

    this.#filmsListTopRatedPresenter = new FilmListPresenter(
      this.#filmsComponent,
      this.#handleFilmChange,
      this.#handleUpdatePopup,
      'Top rated',
      false,
      true
    );
    this.#filmsListTopRatedPresenter.init(this.#filmsModel.getMostRated());
    this.#filmListPresenters.push(this.#filmsListTopRatedPresenter);

    this.#filmsListMostCommentedPresenter = new FilmListPresenter(
      this.#filmsComponent,
      this.#handleFilmChange,
      this.#handleUpdatePopup,
      'Most commented',
      false,
      true
    );
    this.#filmsListMostCommentedPresenter.init(this.#filmsModel.getMostCommented());
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

  #handleUpdatePopup = (film) => {
    this.#popupPresenter.init(film, this.#commentsModel);
  };

  #handleSortTypeChange = (sortType) => {

    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#filmListPresenter.init(this.#films);
  };

  #sortFilms = (sortType) => {

    const sortObject = this.#sorts.find((item) => item.sortType === sortType);
    if (sortObject) {
      this.#films = sortObject.sortFilms();
      this.#currentSortType = sortType;
    }

  };

}
