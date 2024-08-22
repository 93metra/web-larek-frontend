import { IEvents } from '../components/base/events';
import { IModal } from '../types/index';

export class ModalView implements IModal {
  private _content: HTMLElement;
  private _container: HTMLElement;
  private closeButton: HTMLButtonElement;
  private events: IEvents;

  constructor(events: IEvents, container: HTMLElement) {
    this.events = events;
    this._container = container;
    this.closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
    this._content = container.querySelector('.modal__content') as HTMLElement;

    this.closeButton.addEventListener('click', () => this.close());
    this._container.addEventListener('click', (event: MouseEvent) => this.onContainerClick(event));
  }

  set content(value: HTMLElement) {
    this._content.innerHTML = '';
    this._content.appendChild(value);
  }

  open() {
    this._container.classList.add('modal_active');
    this.emitOpenEvent();
  }

  close() {
    this._container.classList.remove('modal_active');
    this.emitCloseEvent();
    this._content.innerHTML = '';
  }

  private onContainerClick(event: MouseEvent) {
    if (event.target === this._container) {
      this.close();
    }
  }

  private emitCloseEvent() {
    this.events.emit('modal:close');
  }

  private emitOpenEvent() {
    this.events.emit('modal:open');
  }
};