import Observable from '../framework/observable.js';
import {generateOffer, generateOfferType} from '../mock/offers.js';

export default class OffersModel extends Observable {
  #offers = Array.from({length: 10}, generateOffer);
  #offerTypes = Array.from({length: 9}, generateOfferType);

  get offers() {
    return this.#offers;
  }

  get offerTypes() {
    return this.#offerTypes;
  }
}
