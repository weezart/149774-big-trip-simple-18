import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import NoEventsView from '../view/no-events-view';
import {render, RenderPosition, remove} from '../framework/render.js';
import EventPresenter from './event-presenter.js';
import EventNewPresenter from './event-new-presenter.js';
import LoadingView from '../view/loading-view.js';
import {eventFilter} from '../utils/event-filter.js';
import {sortByDay, sortByPrice} from '../utils/event.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #eventListComponent = new EventListView();
  #loadingComponent = new LoadingView();
  #noEventComponent = null;
  #sortComponent = null;

  #eventPresenter = new Map();
  #eventNewPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  constructor(boardContainer, pointsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = eventFilter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }

    return filteredPoints.sort(sortByDay);
  }

  get eventsData() {
    const eventsOffers = [...this.#pointsModel.offers];
    const eventsDestinations = [...this.#pointsModel.destinations];

    return {
      offers: eventsOffers,
      destinations: eventsDestinations
    };
  }

  init = () => {
    this.#renderBoard();
  };

  createEvent = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#eventNewPresenter.init(callback);
  };

  #handleModeChange = () => {
    this.#eventNewPresenter.destroy();
    this.#eventPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#eventPresenter.get(update.id).setSaving();
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#eventNewPresenter.setSaving();
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#eventPresenter.get(update.id).setDeleting();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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

  #renderLoading = () => {
    render(this.#loadingComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #renderNoEvents = () => {
    this.#noEventComponent = new NoEventsView(this.#filterType);

    render(this.#noEventComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#eventNewPresenter.destroy();
    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noEventComponent) {
      remove(this.#noEventComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderBoard = () => {
    this.#eventNewPresenter = new EventNewPresenter(this.#eventListComponent.element, this.eventsData, this.#handleViewAction);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    render(this.#eventListComponent, this.#boardContainer);

    this.#renderEvents(this.points);
  };

  #renderEvent = (point) => {
    const eventPresenter = new EventPresenter(this.#eventListComponent.element, this.eventsData, this.#handleViewAction, this.#handleModeChange);
    eventPresenter.init(point);
    this.#eventPresenter.set(point.id, eventPresenter);
  };
}
