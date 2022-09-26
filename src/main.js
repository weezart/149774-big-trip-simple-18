import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import NewEventButtonView from './view/new-event-button-view.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsApiService from './points-api-service.js';
const newEventButtonComponent = new NewEventButtonView();


const AUTHORIZATION = 'Basic gXS2sg404s4d4gwl1sd2wj';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(siteMainElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(filtersElement, filterModel, pointsModel);

const handleNewEventFormClose = () => {
  newEventButtonComponent.element.disabled = false;
};

const handleNewEventButtonClick = () => {
  boardPresenter.createEvent(handleNewEventFormClose);
  newEventButtonComponent.element.disabled = true;
};

filterPresenter.init();
boardPresenter.init();

pointsModel.init().finally(() => {
  render(newEventButtonComponent, siteHeaderElement);
  newEventButtonComponent.setClickHandler(handleNewEventButtonClick);
});
