import FiltersView from './view/filters-view.js';
import {render} from './render.js';
import BoardPresenter from './presenter/board-presenter.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import TripPointsModel from './model/trip-points-model.js';

const siteMainElement = document.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');

const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const tripPointsModel = new TripPointsModel();
const boardPresenter = new BoardPresenter(siteMainElement, offersModel, destinationsModel, tripPointsModel);

render(new FiltersView(), filtersElement);
boardPresenter.init();
