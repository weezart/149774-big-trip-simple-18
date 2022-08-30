import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventAddView from '../view/event-add-view.js';
import EventView from '../view/event-view.js';
import {render} from '../render.js';
import {getRandomInteger, getRandomizedReducedArray} from '../utils';

export default class BoardPresenter {
  #boardContainer = null;
  #offersModel = null;
  #destinationsModel = null;
  #tripPointsModel = null;

  #eventListComponent = new EventListView();
  #eventAddComponent = new EventAddView();

  #offers = [];
  #offerTypes = [];
  #destinations = [];
  #tripPoints = [];

  init = (boardContainer, offersModel, destinationsModel, tripPointsModel) => {
    this.#boardContainer = boardContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#tripPointsModel = tripPointsModel;

    this.#offers = [...this.#offersModel.offers];
    this.#offerTypes = [...this.#offersModel.offerTypes];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#tripPoints = [...this.#tripPointsModel.tripPoints];

    render(new SortView(), this.#boardContainer);
    render(this.#eventListComponent, this.#boardContainer);

    // Временные функции для проверки работы формы создания
    render(this.#eventAddComponent, this.#eventListComponent.element);
    this.#eventAddComponent.element.remove();

    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderEvent(this.#tripPoints[i]);
    }
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
      this.#eventListComponent.element.replaceChild(eventEditComponent.element, eventComponent.element);
    };

    const replaceFormToCard = () => {
      this.#eventListComponent.element.replaceChild(eventComponent.element, eventEditComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    eventComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    eventEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    eventEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(eventComponent, this.#eventListComponent.element);
  };
}
