import {generateOffer, generateOfferType} from '../mock/offers.js';

export default class OffersModel {
  offers = Array.from({length: 10}, generateOffer);
  offerTypes = Array.from({length: 9}, generateOfferType);

  getOffers = () => this.offers;
  getOfferTypes = () => this.offerTypes;
}
