import {OFFERS, OFFER_TYPES} from './data';
import {getRandomArrayItem, getRandomInteger, getRandomizedReducedArray} from '../utils';


let counterOffers = 0;
let offerId = 0;

export const generateOffer = () => ({
  id:  counterOffers++,
  title: getRandomArrayItem(OFFERS),
  price: getRandomInteger(100, 1000)
});

const getIntegerArray = Array.from({length: 100}, () => offerId++);

export const generateOfferType = () => ({
  type:  getRandomArrayItem(OFFER_TYPES),
  offers: getRandomizedReducedArray(getIntegerArray, getRandomInteger(0, 3))
});
