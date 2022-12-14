import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {BLANK_POINT} from '../const.js';
import {ucFirst, isNumeric} from '../utils/common.js';
import {humanizeDate} from '../utils/event.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const createDestinationTemplate = (destination) => destination ?
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination ? destination.description : ''}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${destination.pictures.map((picture) => `
          <img class="event__photo" src="${picture.src}" alt="${picture.description}">
        `).join('\n')}
      </div>
    </div>
  </section>
  `
  : '';

const createEventEditTemplate = (point, eventsData) => {
  const destination = eventsData.destinations.find((destinationsItem) => destinationsItem.id === point.destination);
  const offersByType = eventsData.offers.find((offersItem) => offersItem.type === point.type).offers;
  const offers = offersByType.filter(({id}) => point.offers.some((offerId) => offerId === id));

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
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${point.isDisabled ? 'disabled' : ''}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${eventsData.offers.map((offer) => `
                <div class="event__type-item">
                  <input
                        id="event-type-${offer.type}-1"
                        class="event__type-input  visually-hidden"
                        type="radio"
                        name="event-type"
                        value="${offer.type}"
                         ${point.isDisabled ? 'disabled' : ''}
                  >
                  <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${ucFirst(offer.type)}</label>
                </div>
              `).join('\n')}

            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${point.type}
          </label>
          <input
                class="event__input  event__input--destination"
                id="event-destination-1"
                type="text"
                name="event-destination"
                value="${destination ? destination.name : ''}"
                ${point.isDisabled ? 'disabled' : ''}
                list="destination-list-1"
          >
          <datalist id="destination-list-1">
            ${eventsData.destinations.map((destinationsItem) => `
              <option value="${destinationsItem.name}"></option>
            `).join('\n')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(point.dateFrom)}" ${point.isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(point.dateTo)}" ${point.isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice !== null ? point.basePrice : ''}" ${point.isDisabled ? 'disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${point.isDisabled ? 'disabled' : ''}>
          ${point.isSaving ? 'Saving...' : 'Save'}
        </button>
        <button class="event__reset-btn" type="reset" ${point.isDisabled ? 'disabled' : ''}>
          ${point.isDeleting ? 'Deleting...' : 'Delete'}
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersByType.map((availableOffer) => `
                <div class="event__offer-selector">
                  <input
                    class="event__offer-checkbox  visually-hidden"
                    id="event-offer-${availableOffer.id}-1"
                    type="checkbox" name="event-offer--${availableOffer.id}"
                    data-offer-id="${availableOffer.id}"
                    ${offersId.has(availableOffer.id) ? 'checked' : ''}
                    ${point.isDisabled ? 'disabled' : ''}
                  >

                  <label class="event__offer-label" for="event-offer-${availableOffer.id}-1">
                    <span class="event__offer-title">${availableOffer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${availableOffer.price}</span>
                  </label>
                </div>
              `).join('\n')}
          </div>
        </section>

        ${createDestinationTemplate(destination)}
      </section>
    </form>
  </li>`
  );
};

export default class EventEditView extends AbstractStatefulView {
  #eventsData = null;
  #dateFromPicker = null;
  #dateToPicker = null;

  constructor(point = BLANK_POINT, eventsData) {
    super();

    this._state = EventEditView.parsePointToState(point);
    this.#eventsData = eventsData;

    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createEventEditTemplate(this._state, this.#eventsData);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#dateFromPicker) {
      this.#dateFromPicker.destroy();
      this.#dateFromPicker = null;
    }

    if (this.#dateToPicker) {
      this.#dateToPicker.destroy();
      this.#dateToPicker = null;
    }
  };

  reset = (point) => {
    this.updateElement(
      EventEditView.parsePointToState(point),
    );
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  validatePrice = (price) => isNumeric(price) && +price > 0;
  validateDestination = (destination) => destination
    ? Boolean(this.#eventsData.destinations.find((destinationsItem) => destinationsItem.name === destination))
    : false;

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setCloseClickHandler(this._callback.closeClick);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const destinationValue = this.element.querySelector('.event__input--destination').value;
    if (this.validatePrice(this._state.basePrice) && this.validateDestination(destinationValue)) {
      this._callback.formSubmit(EventEditView.parseStateToPoint(this._state));
    }
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

  #eventOfferToggleHandler = (evt) => {
    evt.preventDefault();
    const eventOffers = [...this._state.offers];
    const offerId = Number(evt.target.dataset.offerId);
    const offerIndex = eventOffers.indexOf(offerId);
    this._setState({
      offers: offerIndex !== -1 ? eventOffers.splice(offerIndex, 1) : eventOffers.push(offerId),
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    evt.target.setCustomValidity(!this.validatePrice(evt.target.value) ? '???????????? ???????? ?????????????? ?????????? ?????????????????????????? ??????????.' : '');
    this._setState({
      basePrice: +evt.target.value,
    });
  };

  #eventDestinationInputHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.value) {
      const currentDestination = this.#eventsData.destinations.find((destinationsItem) => destinationsItem.name === evt.target.value);
      evt.target.setCustomValidity(!currentDestination ? '???????????????????? ???? ???????????? ???????????????????????? ????????????????.' : '');
      if (currentDestination) {
        this.updateElement({
          destination: currentDestination.id,
        });
      }
    } else {
      evt.target.setCustomValidity('???? ???????????? ?????????? ????????????????????.');
    }
  };

  #changeDateFromHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate
    });
  };

  #changeDateToHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate
    });
  };

  #setDatepicker = () => {
    this.#dateFromPicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        maxDate: this._state.dateTo,
        enableTime: true,
        onChange: this.#changeDateFromHandler
      }
    );

    this.#dateToPicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        enableTime: true,
        onChange: this.#changeDateToHandler
      }
    );
  };

  #setInnerHandlers = () => {
    Array.from(this.element.querySelectorAll('.event__type-input')).forEach(
      (typeElement) => typeElement.addEventListener('click', this.#eventTypeToggleHandler)
    );
    Array.from(this.element.querySelectorAll('.event__offer-checkbox')).forEach(
      (offerElement) => offerElement.addEventListener('change', this.#eventOfferToggleHandler)
    );
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#eventDestinationInputHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EventEditView.parseStateToPoint(this._state));
  };

  static parsePointToState = (point) => ({...point,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };
}
