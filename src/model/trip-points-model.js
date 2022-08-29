import {generateTripPoint} from '../mock/trip-points';

export default class TripPointsModel {
  #tripPoints = Array.from({length: 5}, generateTripPoint);

  get tripPoints() {
    return this.#tripPoints;
  }
}
