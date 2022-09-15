import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EventAddView from '../view/event-add-view.js';
import NoEventsView from '../view/no-events-view';
import {render, RenderPosition, remove} from '../framework/render.js';
import {getRandomInteger, getRandomizedReducedArray} from '../utils/common.js';
import EventPresenter from './event-presenter.js';
import {eventFilter} from '../utils/event-filter.js';
import {sortByDay, sortByPrice, unique} from '../utils/event.js';
import {SortType, UpdateType, UserAction} from '../const.js';

export default class BoardPresenter {
  #boardContainer = null;
  #offersModel = null;
  #destinationsModel = null;
  #pointsModel = null;
  #filterModel = null;

  #eventListComponent = new EventListView();
  #eventAddComponent = new EventAddView();
  #noEventComponent = new NoEventsView();
  #sortComponent = null;

  #eventPresenter = new Map();
  #currentSortType = SortType.DAY;

  constructor(boardContainer, offersModel, destinationsModel, pointsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = eventFilter[filterType](points);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }

    return filteredPoints.sort(sortByDay);
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
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка
        this.#eventPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);

    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #renderEvents = (points) => {
    points.forEach((point) => this.#renderEvent(point));
  };

  #renderNoEvents = () => {
    render(this.#noEventComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#noEventComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderBoard = () => {
    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    render(this.#eventListComponent, this.#boardContainer);
    this.#renderEvents(this.points);

    // Временные функции для проверки работы формы создания
    render(this.#eventAddComponent, this.#eventListComponent.element);
    remove(this.#eventAddComponent);
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
