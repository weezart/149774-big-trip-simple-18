import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventAddView from '../view/event-add-view.js';
import EventView from '../view/event-view.js';
import NoEventsView from '../view/no-events-view';
import {render, RenderPosition, replace, remove} from '../framework/render.js';
import {getRandomInteger, getRandomizedReducedArray} from '../utils/common.js';

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

  #renderNoEvents = () => {
    render(this.#noEventComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
  };

  #renderBoard = () => {
    if (this.#tripPoints.length === 0) {
      render(new NoEventsView(), this.#boardContainer);
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

    const eventComponent = new EventView(point, destination, offers);
    const eventEditComponent = new EventEditView(point, destination, offers, availableOffers);

    const replaceCardToForm = () => {
      replace(eventEditComponent, eventComponent);
    };

    const replaceFormToCard = () => {
      replace(eventComponent, eventEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    eventComponent.setEditClickHandler(() => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    eventEditComponent.setFormSubmitHandler(() => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    eventEditComponent.setEditClickHandler(() => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(eventComponent, this.#eventListComponent.element);
  };
}
