import { render } from './render.js';
import FilmListPresenter from './presenter/films-list-presenter.js';
import PopupPresenter from './presenter/popup-presenter.js';
import ProfileView from './view/profile-view.js';
import MainNavigationView from './view/main-navigation-view.js';
import SortView from './view/sort-view.js';
import StatisticsView from './view/statistics-view.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const filmListPresenter = new FilmListPresenter();
const popupPresenter = new PopupPresenter();

render(new ProfileView(), headerElement);
render(new MainNavigationView(), mainElement);
render(new SortView(), mainElement);
filmListPresenter.init(mainElement);
render(new StatisticsView(), footerElement);
popupPresenter.init(footerElement, 'afterend');
