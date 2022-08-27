import {generateDestination} from '../mock/destinations';

export default class DestinationsModel {
  destinations = Array.from({length: 10}, generateDestination);

  getDestinations = () => this.destinations;
}
