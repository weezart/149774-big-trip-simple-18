import {render, replace} from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';

export default class EventPresenter {
  #eventListContainer = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #point = null;
  #destination = null;
  #offers = null;
  #availableOffers = null;

  constructor(eventListContainer) {
    this.#eventListContainer = eventListContainer;
  }

  init = (point, destination, offers, availableOffers) => {
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#availableOffers = availableOffers;

    this.#eventComponent = new EventView(point, destination, offers);
    this.#eventEditComponent = new EventEditView(point, destination, offers, availableOffers);

    this.#eventComponent.setEditClickHandler(this.#handleEditClick);
    this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#eventEditComponent.setCloseClickHandler(this.#handleCloseClick);

    render(this.#eventComponent, this.#eventListContainer);
  };

  #replaceCardToForm = () => {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #replaceFormToCard = () => {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToCard();
  };

  #handleCloseClick = () => {
    this.#replaceFormToCard();
  };
}
