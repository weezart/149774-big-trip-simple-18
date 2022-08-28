import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventAddView from '../view/event-add-view.js';
import EventView from '../view/event-view.js';
import {render} from '../render.js';

export default class BoardPresenter {
  eventListComponent = new EventListView();
  eventAddComponent = new EventAddView();

  init = (boardContainer, offersModel, destinationsModel, tripPointsModel) => {
    this.boardContainer = boardContainer;
    this.offersModel = offersModel;
    this.destinationsModel = destinationsModel;
    this.tripPointsModel = tripPointsModel;

    this.offers = [...this.offersModel.getOffers()];
    this.offerTypes = [...this.offersModel.getOfferTypes()];
    this.destinations = [...this.destinationsModel.getDestinations()];
    this.tripPoints = [...this.tripPointsModel.getTripPoints()];

    render(new SortView(), this.boardContainer);
    render(this.eventListComponent, this.boardContainer);

    const editTripDestination = this.destinations.find((destination) => destination.id === this.tripPoints[0].destination);
    const editTripOffers = this.offers.filter(({id}) => this.tripPoints[0].offers.some((offerId) => offerId === id));
    const editTripOfferTypesId = this.offerTypes.find((offerType) => offerType.type === this.tripPoints[0].type);
    const editTripAvailableOffers = this.offers.filter(({id}) => editTripOfferTypesId.offers.some((offerId) => offerId === id));
    render(new EventEditView(this.tripPoints[0], editTripDestination, editTripOffers, editTripAvailableOffers), this.eventListComponent.getElement());

    // Временные функции для проверки работы формы создания
    render(this.eventAddComponent, this.eventListComponent.getElement());
    this.eventAddComponent.getElement().remove();
    for (let i = 1; i < this.tripPoints.length; i++) {
      const tripDestination = this.destinations.find((destination) => destination.id === this.tripPoints[i].destination);
      const tripOffers = this.offers.filter(({id}) => this.tripPoints[i].offers.some((offerId) => offerId === id));
      render(new EventView(this.tripPoints[i], tripDestination, tripOffers), this.eventListComponent.getElement());
    }
  };
}
