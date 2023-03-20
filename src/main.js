import { render } from './framework/render.js';
import BoardView from './view/board-view.js';
import UserProfileView from './view/user-profile-view.js';
import FilmsCountView from './view/films-count-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FiltersModel from './model/filters-model.js';
import FilmsApiService from './api/films-api-service.js';

const AUTHORIZATION = 'Basic sv74dlm5qor';
const END_POINT = 'https://19.ecmascript.pages.academy/cinemaddict/';

const boardComponent = new BoardView();
const mainContainer = document.querySelector('main');
const headerContainer = document.querySelector('header');
const filmsListContainer = boardComponent.element.querySelector('.films-list');
const filmsCountContainer = document.querySelector('.footer__statistics');
const bodyContainer = document.querySelector('body');
const filmsModel = new FilmsModel({
  filmsApiService: new FilmsApiService(END_POINT, AUTHORIZATION)
});
const commentsModel = new CommentsModel();
const filtersModel = new FiltersModel();

const filterPresenter = new FilterPresenter({
  filterContainer: mainContainer,
  filtersModel,
  filmsModel
});

const boardPresenter = new BoardPresenter({
  boardComponent: boardComponent,
  filmsListContainer: filmsListContainer,
  filmsModel,
  commentsModel,
  filtersModel,
  bodyContainer: bodyContainer,
  mainContainer: mainContainer
});

render(new UserProfileView(), headerContainer);
filterPresenter.init();
boardPresenter.init();
render(new FilmsCountView(), filmsCountContainer);

