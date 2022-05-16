import { render } from './framework/render.js';
import { generateFilter } from './mock/filter.js';
import CommentsModel from './model/comments-model.js';
import FilmListPresenter from './presenter/films-list-presenter.js';
import FilmsModel from './model/films-model.js';
import MainNavigationView from './view/main-navigation-view.js';
import ProfileView from './view/profile-view.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');

const filmsModel = new FilmsModel();
const filters = generateFilter(filmsModel);

render(new MainNavigationView(filters), mainElement);
render(new ProfileView(), headerElement);

const commentsModel = new CommentsModel();
const filmListPresenter = new FilmListPresenter(mainElement, filmsModel, commentsModel);

filmListPresenter.init();
