import {generateOffer, generateOfferType} from '../mock/offers';

export default class OffersModel {
  offers = Array.from({length: 10}, generateOffer);
  offerTypes = Array.from({length: 10}, generateOfferType);

  getOffers = () => this.offers;
  getOfferTypes = () => this.offerTypes;
}
