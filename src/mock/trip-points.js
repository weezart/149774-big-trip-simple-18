import {OFFER_TYPES, DATE} from './data.js';
import {getRandomArrayItem, getRandomInteger, getRandomizedReducedArray} from '../utils.js';
import {getIntegerArray} from './offers.js';

import dayjs from 'dayjs';


const generateDate = () => {
  const dateFrom = dayjs(DATE).add(getRandomInteger(0, 5), 'd').add(getRandomInteger(0, 5), 'h').add(getRandomInteger(0, 59), 'm');
  const dateTo = dayjs(dateFrom).add(getRandomInteger(0, 1), 'd').add(getRandomInteger(0, 5), 'h').add(getRandomInteger(0, 59), 'm');
  return {dateFrom, dateTo};
};

export const generateTripPoint = () => {
  const date = generateDate();

  return {
    basePrice: getRandomInteger(100, 2000),
    dateFrom: date.dateFrom,
    dateTo: date.dateTo,
    destination: getRandomInteger(0, 9),
    id: getRandomInteger(0, 9),
    offers: getRandomizedReducedArray(getIntegerArray, getRandomInteger(0, 3)),
    type: getRandomArrayItem(OFFER_TYPES),
  };
};
