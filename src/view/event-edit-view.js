import AbstractView from '../framework/view/abstract-view.js';
import {OFFER_TYPES, DESTINATIONS, OFFER_INPUTS} from '../const.js';
import {ucFirst} from '../utils/common.js';
import {humanizeDate} from '../utils/event.js';

const createEventEditTemplate = (point, destination, offers, availableOffers) => {
  const offersId = new Set();

  for (const offersItem of offers) {
    offersId.add(offersItem.id);
  }

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${OFFER_TYPES.map((type) => `
                <div class="event__type-item">
                  <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
                  <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${ucFirst(type)}</label>
                </div>
              `).join('\n')}

            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${point.type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${DESTINATIONS.map((DESTINATIONS_ITEM) => `
              <option value="${DESTINATIONS_ITEM}"></option>
            `).join('\n')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(point.dateFrom)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(point.dateTo)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="160">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${availableOffers.map((availableOffer) => `
                <div class="event__offer-selector">
                  <input
                    class="event__offer-checkbox  visually-hidden"
                    id="event-offer-${OFFER_INPUTS[availableOffer.title]}-1"
                    type="checkbox" name="event-offer--${OFFER_INPUTS[availableOffer.title]}"
                    ${offersId.has(availableOffer.id) ? 'checked' : ''}>
                  <label class="event__offer-label" for="event-offer-${OFFER_INPUTS[availableOffer.title]}-1">
                    <span class="event__offer-title">${availableOffer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${availableOffer.price}</span>
                  </label>
                </div>
              `).join('\n')}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>
        </section>
      </section>
    </form>
  </li>`
  );
};

export default class EventEditView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;
  #availableOffers = null;

  constructor(point, destination, offers, availableOffers) {
    super();

    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#availableOffers = availableOffers;
  }

  get template() {
    return createEventEditTemplate(this.#point, this.#destination, this.#offers, this.#availableOffers);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit();
  };

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeClickHandler);
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  };
}
