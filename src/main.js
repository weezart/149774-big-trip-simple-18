import FiltersView from './view/filters-view.js';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import NewEventButtonView from './view/new-event-button-view.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');

const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(siteMainElement, offersModel, destinationsModel, pointsModel);
const filterPresenter = new FilterPresenter(filtersElement, filterModel, pointsModel);

render(new NewEventButtonView(), siteHeaderElement);

filterPresenter.init();
boardPresenter.init();
