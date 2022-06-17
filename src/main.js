import CommentsModel from './model/comments-model.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import PagePresenter from './presenter/page-presenter.js';
import FilmsApiService from './api-services/films-api-service.js';
import CommentsApiService from './api-services/comments-api-service.js';

const mainElement = document.querySelector('.main');

const AUTHORIZATION = 'Basic er8878041dw';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const pagePresenter = new PagePresenter(mainElement, filmsModel, commentsModel, filterModel);

pagePresenter.init();
filmsModel.init();
