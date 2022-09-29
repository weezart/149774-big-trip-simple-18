import AbstractView from '../framework/view/abstract-view.js';

const createErrorTemplate = () => (
  `<p class="trip-events__msg">
    There is a problem with the Internet connection, it is impossible to add a new event.
  </p>`
);

export default class ErrorView extends AbstractView {
  get template() {
    return createErrorTemplate();
  }
}
