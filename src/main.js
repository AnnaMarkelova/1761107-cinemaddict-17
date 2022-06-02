import CommentsModel from './model/comments-model.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import PagePresenter from './presenter/page-presenter.js';

const mainElement = document.querySelector('.main');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const pagePresenter = new PagePresenter(mainElement, filmsModel, commentsModel, filterModel);

pagePresenter.init();
