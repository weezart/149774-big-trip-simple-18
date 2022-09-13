import Observable from '../framework/observable.js';
import {generateTripPoint} from '../mock/trip-points';

export default class TripPointsModel extends Observable {
  #tripPoints = Array.from({length: 10}, generateTripPoint);

  get tripPoints() {
    return this.#tripPoints;
  }
}
