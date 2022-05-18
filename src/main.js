import CommentsModel from './model/comments-model.js';
import PagePresenter from './presenter/page-presenter.js';
import FilmsModel from './model/films-model.js';

const mainElement = document.querySelector('.main');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const pagePresenter = new PagePresenter(mainElement, filmsModel, commentsModel);

pagePresenter.init();
