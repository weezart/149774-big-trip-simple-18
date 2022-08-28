import {OFFERS, OFFER_TYPES} from './data.js';
import {getRandomArrayItem, getRandomInteger, getRandomizedReducedArray} from '../utils.js';


let counterOffers = 0;

export const generateOffer = () => ({
  id:  counterOffers++,
  title: getRandomArrayItem(OFFERS),
  price: getRandomInteger(100, 1000)
});

let offerId = 0;
export const getIntegerArray = Array.from({length: 10}, () => offerId++);

let counterOfferTypes = 0;

export const generateOfferType = () => ({
  type:  OFFER_TYPES[counterOfferTypes++],
  offers: getRandomizedReducedArray(getIntegerArray, getRandomInteger(1, 5))
});
