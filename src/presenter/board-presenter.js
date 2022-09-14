import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EventAddView from '../view/event-add-view.js';
import NoEventsView from '../view/no-events-view';
import {render, RenderPosition, remove} from '../framework/render.js';
import {getRandomInteger, getRandomizedReducedArray} from '../utils/common.js';
import EventPresenter from './event-presenter.js';
import {sortByDay, sortByPrice, unique} from '../utils/event.js';
import {SortType} from '../const.js';

export default class BoardPresenter {
  #boardContainer = null;
  #offersModel = null;
  #destinationsModel = null;
  #pointsModel = null;

  #eventListComponent = new EventListView();
  #eventAddComponent = new EventAddView();
  #sortComponent = new SortView();
  #noEventComponent = new NoEventsView();

  #eventPresenter = new Map();
  #currentSortType = SortType.DAY;

  constructor(boardContainer, offersModel, destinationsModel, pointsModel) {
    this.#boardContainer = boardContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortByPrice);
    }

    return [...this.#pointsModel.points].sort(sortByDay);
  }

  get eventsData() {
    const eventsOffers = [...this.#offersModel.offers];
    const eventsOfferTypes = [...this.#offersModel.offerTypes];
    const eventsDestinations = [...this.#destinationsModel.destinations];

    return {
      offers: eventsOffers,
      offerTypes: eventsOfferTypes,
      destinations: eventsDestinations
    };
  }

  init = () => {
    this.#renderBoard();
  };

  #handleModeChange = () => {
    this.#eventPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearEventList();
    this.#renderEventList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderEvents = (points) => {
    points.forEach((point) => this.#renderEvent(point));
  };

  #renderEventList = () => {
    render(this.#eventListComponent, this.#boardContainer);
    this.#renderEvents(this.points);

    // Временные функции для проверки работы формы создания
    render(this.#eventAddComponent, this.#eventListComponent.element);
    remove(this.#eventAddComponent);
  };

  #clearEventList = () => {
    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();
  };

  #renderNoEvents = () => {
    render(this.#noEventComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #renderBoard = () => {
    if (this.points.length === 0) {
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    this.#renderEventList();
  };

  #renderEvent = (point) => {
    // Костыль, проставляющий правильные случайные id из массива только возможных офферов
    const offerTypesId = this.eventsData.offerTypes.find((offerType) => offerType.type === point.type);
    point.offers = unique(getRandomizedReducedArray(offerTypesId.offers, getRandomInteger(0, 3)));

    const eventPresenter = new EventPresenter(this.#eventListComponent.element, this.eventsData, this.#handleViewAction, this.#handleModeChange);
    eventPresenter.init(point);
    this.#eventPresenter.set(point.id, eventPresenter);
  };
}
