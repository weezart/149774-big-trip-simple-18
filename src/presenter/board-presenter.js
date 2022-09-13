import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EventAddView from '../view/event-add-view.js';
import NoEventsView from '../view/no-events-view';
import {render, RenderPosition, remove} from '../framework/render.js';
import {getRandomInteger, getRandomizedReducedArray} from '../utils/common.js';
import EventPresenter from './event-presenter.js';
import {updateEvent} from '../utils/event.js';
import {sortByDay, sortByPrice, unique} from '../utils/event.js';
import {SortType} from '../const.js';

export default class BoardPresenter {
  #boardContainer = null;
  #offersModel = null;
  #destinationsModel = null;
  #tripPointsModel = null;
  #eventsData = null;

  #eventListComponent = new EventListView();
  #eventAddComponent = new EventAddView();
  #sortComponent = new SortView();
  #noEventComponent = new NoEventsView();

  #offers = [];
  #offerTypes = [];
  #destinations = [];
  #tripPoints = [];
  #eventPresenter = new Map();
  #currentSortType = SortType.DAY;
  #sourcedBoardPoints = [];

  constructor(boardContainer, offersModel, destinationsModel, tripPointsModel) {
    this.#boardContainer = boardContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#tripPointsModel = tripPointsModel;
  }

  get points() {
    return this.#tripPointsModel.tripPoints;
  }

  init = () => {
    this.#offers = [...this.#offersModel.offers];
    this.#offerTypes = [...this.#offersModel.offerTypes];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#eventsData = {
      offers: this.#offers,
      offerTypes: this.#offerTypes,
      destinations: this.#destinations
    };
    this.#tripPoints = [...this.#tripPointsModel.tripPoints].sort(sortByDay);
    this.#sourcedBoardPoints = [...this.#tripPoints];
    this.#renderBoard();
  };

  #handleModeChange = () => {
    this.#eventPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleEventChange = (updatedEvent) => {
    this.#tripPoints = updateEvent(this.#tripPoints, updatedEvent);
    this.#sourcedBoardPoints = updateEvent(this.#sourcedBoardPoints, updatedEvent);

    this.#eventPresenter.get(updatedEvent.id).init(updatedEvent, this.#eventsData);
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.PRICE:
        this.#tripPoints.sort(sortByPrice);
        break;
      default:
        this.#tripPoints.sort(sortByDay);
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearEventList();
    this.#renderEventList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderEvents = (from, to) => {
    this.#tripPoints
      .slice(from, to)
      .forEach((point) => this.#renderEvent(point));
  };

  #renderEventList = () => {
    render(this.#eventListComponent, this.#boardContainer);
    this.#renderEvents(0, this.#tripPoints.length);

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
    if (this.#tripPoints.length === 0) {
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    this.#renderEventList();
  };

  #renderEvent = (point) => {
    // Костыль, проставляющий правильные случайные id из массива только возможных офферов
    const offerTypesId = this.#offerTypes.find((offerType) => offerType.type === point.type);
    point.offers = unique(getRandomizedReducedArray(offerTypesId.offers, getRandomInteger(0, 3)));

    const eventPresenter = new EventPresenter(this.#eventListComponent.element, this.#eventsData, this.#handleEventChange, this.#handleModeChange);
    eventPresenter.init(point);
    this.#eventPresenter.set(point.id, eventPresenter);
  };
}
