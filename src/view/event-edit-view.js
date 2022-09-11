import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {OFFER_TYPES, DESTINATIONS, OFFER_INPUTS, BLANK_POINT} from '../const.js';
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
            <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
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
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}">
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

export default class EventEditView extends AbstractStatefulView {
  #destination = null;
  #offers = null;
  #availableOffers = null;

  constructor(point = BLANK_POINT, destination, offers, availableOffers) {
    super();

    this._state = EventEditView.parsePointToState(point);
    this.#destination = destination;
    this.#offers = offers;
    this.#availableOffers = availableOffers;

    this.#setInnerHandlers();
  }

  get template() {
    return createEventEditTemplate(this._state, this.#destination, this.#offers, this.#availableOffers);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EventEditView.parseStateToPoint(this._state), this.#destination, this.#offers, this.#availableOffers);
  };

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeClickHandler);
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  };

  #eventTypeToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #eventDestinationInputHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.value) {
      this.updateElement({
        destination: evt.target.value,
      });
    }
  };

  #setInnerHandlers = () => {
    Array.from(this.element.querySelectorAll('.event__type-input')).forEach(
      (typeElement) => typeElement.addEventListener('click', this.#eventTypeToggleHandler)
    );
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#eventDestinationInputHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
  };

  static parsePointToState = (point) => ({...point});

  static parseStateToPoint = (state) => ({...state});
}
