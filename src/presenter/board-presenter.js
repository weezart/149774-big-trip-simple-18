import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EventAddView from '../view/event-add-view.js';
import NoEventsView from '../view/no-events-view';
import {render, RenderPosition, remove} from '../framework/render.js';
import {getRandomInteger, getRandomizedReducedArray} from '../utils/common.js';
import EventPresenter from './event-presenter.js';
import {updateEvent} from '../utils/event.js';

export default class BoardPresenter {
  #boardContainer = null;
  #offersModel = null;
  #destinationsModel = null;
  #tripPointsModel = null;

  #eventListComponent = new EventListView();
  #eventAddComponent = new EventAddView();
  #sortComponent = new SortView();
  #noEventComponent = new NoEventsView();

  #offers = [];
  #offerTypes = [];
  #destinations = [];
  #tripPoints = [];
  #eventPresenter = new Map();

  constructor(boardContainer, offersModel, destinationsModel, tripPointsModel) {
    this.#boardContainer = boardContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#tripPointsModel = tripPointsModel;
  }

  init = () => {
    this.#offers = [...this.#offersModel.offers];
    this.#offerTypes = [...this.#offersModel.offerTypes];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#tripPoints = [...this.#tripPointsModel.tripPoints];

    this.#renderBoard();
  };

  #handleEventChange = (updatedEvent, destination, offers, availableOffers) => {
    this.#tripPoints = updateEvent(this.#tripPoints, updatedEvent);

    this.#eventPresenter.get(updatedEvent.id).init(updatedEvent, destination, offers, availableOffers);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
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
    const offerTypesId = this.#offerTypes.find((offerType) => offerType.type === point.type);

    // Костыль, проставляющий правильные случайные id из массива только возможных офферов
    point.offers = getRandomizedReducedArray(offerTypesId.offers, getRandomInteger(0, 3));

    const destination = this.#destinations.find((destinationsItem) => destinationsItem.id === point.destination);
    const offers = this.#offers.filter(({id}) => point.offers.some((offerId) => offerId === id));
    const availableOffers = this.#offers.filter(({id}) => offerTypesId.offers.some((offerId) => offerId === id));


    const eventPresenter = new EventPresenter(this.#eventListComponent.element, this.#handleEventChange);
    eventPresenter.init(point, destination, offers, availableOffers);
    this.#eventPresenter.set(point.id, eventPresenter);
  };
}
