import { render } from './framework/render.js';
import BoardView from './view/board-view.js';
import UserProfileView from './view/user-profile-view.js';
import FilterView from './view/filter-view.js';
import FilmsCountView from './view/films-count-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilmsModel from './model/films-model.js';
import { generateFilter } from './utils.js';

const boardComponent = new BoardView();
const mainContainer = document.querySelector('main');
const headerContainer = document.querySelector('header');
const filmsListContainer = boardComponent.element.querySelector('.films-list');
const filmsCountContainer = document.querySelector('.footer__statistics');
const bodyContainer = document.querySelector('body');
const filmsModel = new FilmsModel();
const filters = generateFilter(filmsModel.films);
const boardPresenter = new BoardPresenter({
  boardComponent: boardComponent,
  boardContainer: mainContainer,
  filmsListContainer: filmsListContainer,
  filmsModel,
  bodyContainer: bodyContainer,
  mainContainer: mainContainer
});

render(new UserProfileView(), headerContainer);
render(new FilterView({filters}), mainContainer);
boardPresenter.init();
render(new FilmsCountView(), filmsCountContainer);

