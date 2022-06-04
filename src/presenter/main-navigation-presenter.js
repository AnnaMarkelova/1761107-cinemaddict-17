import { render, replace, remove } from '../framework/render.js';
import { UpdateType } from '../const.js';
import MainNavigationView from '../view/main-navigation-view.js';
import { FilterType } from '../const.js';

export default class MainNavigationPresenter {

  #filterContainer;
  #filterModel;
  #filmModel;
  #currentFilterType = FilterType.ALL;

  #mainNavigationComponent = null;

  constructor(filterContainer, filterModel, filmModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmModel = filmModel;

    this.#filmModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: this.#filmModel.films.length,
      },
      {
        type: FilterType.WATCH_LIST,
        name: 'Watchlist',
        count: this.#filmModel.getWatchList().length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: this.#filmModel.getAlreadyWatchedList().length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: this.#filmModel.getFavoriteList().length,
      },
    ];
  }

  init = () => {

    const prevMainNavigationComponent = this.#mainNavigationComponent;
    this.#mainNavigationComponent = new MainNavigationView(this.filters, this.#currentFilterType);
    this.#setupFilterHandlers();

    if (prevMainNavigationComponent === null) {
      this.#renderFilters();
      return;
    }

    replace(this.#mainNavigationComponent, prevMainNavigationComponent);
    remove(prevMainNavigationComponent);
  };

  #renderFilters = () => {
    render(this.#mainNavigationComponent, this.#filterContainer);
  };

  #setupFilterHandlers = () => {
    this.#mainNavigationComponent.setFilterTypeChangeHandler(this.#handlerClick);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handlerClick = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#currentFilterType = filterType;
    this.#filterModel.setFilter(UpdateType.PATCH, filterType);
  };
}

