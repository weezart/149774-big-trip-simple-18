import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventAddView from '../view/event-add-view.js';
import EventView from '../view/event-view.js';
import {render} from '../render.js';

export default class BoardPresenter {
  #boardContainer = null;
  #offersModel = null;
  #destinationsModel = null;
  #tripPointsModel = null;

  eventListComponent = new EventListView();
  eventAddComponent = new EventAddView();

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
    render(this.eventListComponent, this.#boardContainer);

    // const editTripDestination = this.#destinations.find((destination) => destination.id === this.#tripPoints[0].destination);
    // const editTripOffers = this.#offers.filter(({id}) => this.#tripPoints[0].offers.some((offerId) => offerId === id));
    // const editTripOfferTypesId = this.#offerTypes.find((offerType) => offerType.type === this.#tripPoints[0].type);
    // const editTripAvailableOffers = this.#offers.filter(({id}) => editTripOfferTypesId.offers.some((offerId) => offerId === id));
    // render(new EventEditView(this.#tripPoints[0], editTripDestination, editTripOffers, editTripAvailableOffers), this.eventListComponent.element);

    // Временные функции для проверки работы формы создания
    render(this.eventAddComponent, this.eventListComponent.element);
    this.eventAddComponent.element.remove();
    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderEvent(this.#tripPoints[i]);
    }
  };

  #renderEvent = (point) => {
    const destination = this.#destinations.find((destinationsItem) => destinationsItem.id === point.destination);
    const offers = this.#offers.filter(({id}) => point.offers.some((offerId) => offerId === id));
    const eventComponent = new EventView(point, destination, offers);

    render(eventComponent, this.eventListComponent.element);
  };
}
