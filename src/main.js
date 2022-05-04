import { render } from './render.js';
import FilmListPresenter from './presenter/films-list-presenter.js';
import ProfileView from './view/profile-view.js';
import MainNavigationView from './view/main-navigation-view.js';
import SortView from './view/sort-view.js';
import StatisticsView from './view/statistics-view.js';
import FilmsModel from './model/films-model.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const filmListPresenter = new FilmListPresenter();
const filmsModel = new FilmsModel();

render(new ProfileView(), headerElement);
render(new MainNavigationView(), mainElement);
render(new SortView(), mainElement);
filmListPresenter.init(mainElement, filmsModel);
render(new StatisticsView(), footerElement);
