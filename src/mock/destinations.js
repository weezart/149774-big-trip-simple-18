import {getRandomInteger, getRandomizedReducedArray, getRandomArrayItem} from '../utils/common.js';
import {DESCRIPTIONS, DESTINATIONS, PHOTO_URL} from '../const.js';

const generatePicture = () => ({
  src: PHOTO_URL,
  description: getRandomArrayItem(DESCRIPTIONS)
});

let counterDestination = 0;


export const generateDestination = () => ({
  id:  counterDestination++,
  description: getRandomizedReducedArray(DESCRIPTIONS, getRandomInteger(1, 5)).join(),
  name: DESTINATIONS[counterDestination - 1],
  pictures: Array.from({length: getRandomInteger(0, 4)}, generatePicture)
});
