import AbstractView from '../framework/view/abstract-view.js';
import {
  humanizeDateToTime,
  humanizeDateToTimeDate,
  humanizeDateToTimeDateMini,
  humanizeDateToDayMonth
} from '../utils/event.js';

const createOffers = (offers) => {
  if (offers.length === 0) {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">No additional offers</span>
      </li>`
    );
  } else {
    return (
      offers.map((offer) => `
       <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>
    `).join('\n')
    );
  }
};

const createEventTemplate = (point, destination, offers) => (
  `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${humanizeDateToTimeDateMini(point.dateFrom)}">${humanizeDateToDayMonth(point.dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${point.type} ${destination ? destination.name : ''}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${humanizeDateToTimeDate(point.dateFrom)}">${humanizeDateToTime(point.dateFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime="${humanizeDateToTimeDate(point.dateTo)}">${humanizeDateToTime(point.dateTo)}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createOffers(offers)}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
);

export default class EventView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;

  constructor(point, eventsData) {
    super();

    this.#point = point;
    this.#destination = eventsData.destinations.find((destinationsItem) => destinationsItem.id === point.destination);
    const offersByType = eventsData.offers.find((offersItem) => offersItem.type === point.type).offers;
    this.#offers = offersByType.filter(({id}) => point.offers.some((offerId) => offerId === id));
  }

  get template() {
    return createEventTemplate(this.#point, this.#destination, this.#offers);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };
}
