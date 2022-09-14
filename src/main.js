import FiltersView from './view/filters-view.js';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import NewEventButtonView from './view/new-event-button-view.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import PointsModel from './model/points-model.js';
import {generateEventFilter} from './mock/event-filter.js';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');

const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const tripPointsModel = new PointsModel();

const boardPresenter = new BoardPresenter(siteMainElement, offersModel, destinationsModel, tripPointsModel);
const eventFilters = generateEventFilter(tripPointsModel.points);

render(new NewEventButtonView(), siteHeaderElement);
render(new FiltersView(eventFilters), filtersElement);
boardPresenter.init();
