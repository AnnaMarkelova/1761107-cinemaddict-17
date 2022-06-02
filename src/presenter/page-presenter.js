
import { render, remove } from '../framework/render.js';
import { generateFilter } from '../mock/filter.js';
import { SortType, UpdateType, UserAction } from '../const.js';
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
  #filmsComponent = new FilmsView;
  #filmsModel;
  #filmsListMostCommentedPresenter;
  #filmsListComponent = new FilmsListView;
  #filmListContainer;
  #filmListPresenter;
  #filmsListTopRatedPresenter;
  #mainNavigationComponent;
  #popupPresenter;
  #sortComponent = new SortView;

  #filmListPresenters = [];

  #sorts = [
    {
      sortType: SortType.DEFAULT,
      sortFilms: () => this.#filmsModel.films,
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
    this.#popupPresenter = new PopupPresenter(this.#handleViewAction);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    const sortObject = this.#sorts.find((item) => item.sortType === this.#currentSortType);
    if (sortObject) {
      return sortObject.sortFilms();
    }
    return this.#filmsModel.films;
  }

  init = () => {
    this.#renderMainNavigation();
    this.#renderProfileView();
    this.#renderFilmsBoard();
    this.#renderStatistic();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILMS:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.MINOR:
        {
          if (data.isDelete) {
            //удаляет комментарий в фильме
            this.#filmsModel.deleteComment(data.film, data.comment.id);
          } else {
            //добавляет комментарий в фильме
            this.#filmsModel.addComment(data.film, data.comment.id);
          }
          //обновляет карточки фильмов
          this.#filmListPresenters.forEach((presenter) => {
            const filmPresenter = presenter.getFilmPresenterMap().get(data.film.id);
            if (filmPresenter) {
              filmPresenter.init(data.film, true);
            }
          });
          //перерисовывает most commented
          this.#filmsListMostCommentedPresenter.init(this.#filmsModel.getMostCommented());
        }
        break;
      case UpdateType.MAJOR:
        this.#clearMainNavigation();
        this.#renderMainNavigation();
        this.#filmListPresenters.forEach((presenter) => {
          this.#updateFilmList(presenter, data);
        });
        break;
    }
  };

  #updateFilmList = (filmListPresenter, updatedFilm) => {
    const filmPresenterMap = filmListPresenter.getFilmPresenterMap();
    if (filmPresenterMap.has(updatedFilm.id)) {
      filmPresenterMap.get(updatedFilm.id).init(updatedFilm, this.#commentsModel);
    }
  };

  #renderFilmsBoard = () => {

    if (!this.films.length) {
      this.#renderNoFilms();
    } else {
      this.#renderSorts();
      this.#renderFilmsList();
    }

  };

  #renderMainNavigation = () => {
    const filters = generateFilter(this.#filmsModel);
    this.#mainNavigationComponent = new MainNavigationView(filters);
    render(this.#mainNavigationComponent, mainElement, 'AFTERBEGIN');
  };

  #clearMainNavigation = () => {
    remove(this.#mainNavigationComponent);
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
      this.#handleViewAction,
      this.#handleShowPopup,
      'All movies. Upcoming',
      true,
      false
    );
    this.#filmListPresenter.init(this.#filmsModel.films);
    this.#filmListPresenters.push(this.#filmListPresenter);

    this.#filmsListTopRatedPresenter = new FilmListPresenter(
      this.#filmsComponent,
      this.#handleViewAction,
      this.#handleShowPopup,
      'Top rated',
      false,
      true
    );
    this.#filmsListTopRatedPresenter.init(this.#filmsModel.getMostRated());
    this.#filmListPresenters.push(this.#filmsListTopRatedPresenter);

    this.#filmsListMostCommentedPresenter = new FilmListPresenter(
      this.#filmsComponent,
      this.#handleViewAction,
      this.#handleShowPopup,
      'Most commented',
      false,
      true
    );
    this.#filmsListMostCommentedPresenter.init(this.#filmsModel.getMostCommented());
    this.#filmListPresenters.push(this.#filmsListMostCommentedPresenter);
  };

  #renderStatistic = () => {
    render(new StatisticsView(this.#filmsModel.films.length), footerElement);
  };

  #handleShowPopup = (film) => {
    this.#popupPresenter.init(film, this.#commentsModel);
  };

  #handleSortTypeChange = (sortType) => {

    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#filmListPresenter.init(this.films);
  };

}
