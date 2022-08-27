import {getRandomInteger, getRandomizedReducedArray, getRandomArrayItem} from '../utils';
import {DESCRIPTIONS, DESTINATIONS, PHOTO_URL} from './data';

const generatePicture = () => ({
  src: `${PHOTO_URL + getRandomInteger(1, 500)}`,
  description: getRandomArrayItem(DESCRIPTIONS)
});

let counterDestination = 0;

export const generateDestination = () => ({
  id:  counterDestination++,
  description: getRandomizedReducedArray(DESCRIPTIONS, getRandomInteger(1, 5)),
  name: getRandomArrayItem(DESTINATIONS),
  pictures: Array.from({length: getRandomInteger(0, 4)}, generatePicture)
});
