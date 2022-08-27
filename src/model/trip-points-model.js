import {generateTripPoint} from '../mock/trip-points';

export default class TripPointsModel {
  tripPoints = Array.from({length: 3}, generateTripPoint);

  getTripPoints = () => this.tripPoints;
}
