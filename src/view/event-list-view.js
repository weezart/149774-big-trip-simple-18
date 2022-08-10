import View from './view.js';

const createEventListTemplate = () => (
  `<ul class="trip-events__list"></ul>
  `
);

export default class EventListView extends View {
  getTemplate() {
    return createEventListTemplate();
  }
}
