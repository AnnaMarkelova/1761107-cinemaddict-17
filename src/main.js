import { render } from './render.js';
import FilmListPresenter from './presenter/films-list-presenter.js';
import ProfileView from './view/profile-view.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filmListPresenter = new FilmListPresenter(mainElement, filmsModel, commentsModel);

render(new ProfileView(), headerElement);
filmListPresenter.init();
