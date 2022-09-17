import Observable from '../framework/observable.js';
import {generateDestination} from '../mock/destinations.js';

export default class DestinationsModel extends Observable {
  #destinations = Array.from({length: 10}, generateDestination);

  get destinations() {
    return this.#destinations;
  }
}
