import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventAddView from '../view/event-add-view.js';
import EventView from '../view/event-view.js';
import {render} from '../render.js';

export default class BoardPresenter {
  eventListComponent = new EventListView();
  eventAddComponent = new EventAddView();

  init = (boardContainer) => {
    this.boardContainer = boardContainer;
    render(new SortView(), this.boardContainer);
    render(this.eventListComponent, this.boardContainer);
    render(new EventEditView(), this.eventListComponent.getElement());

    // Временные функции для проверки работы формы создания
    render(this.eventAddComponent, this.eventListComponent.getElement());
    this.eventAddComponent.getElement().remove();

    for (let i = 0; i < 3; i++) {
      render(new EventView(), this.eventListComponent.getElement());
    }
  };
}
