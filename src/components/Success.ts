import { EventEmitter } from '../components/base/events';
import { ISuccess } from '../types';

export class Success implements ISuccess {
  private events: EventEmitter;
  private template: HTMLTemplateElement;
  private element: HTMLElement;
  private priceElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(events: EventEmitter, template: HTMLTemplateElement) {
    this.events = events;
    this.template = template;
    this.element = document.importNode(this.template.content, true).firstElementChild as HTMLElement;
    this.priceElement = this.element.querySelector('.order-success__description') as HTMLElement;
    this.closeButton = this.element.querySelector('.order-success__close') as HTMLButtonElement;
  }

  render(totalPrice: number): HTMLElement {
    this.priceElement.textContent = `Списано ${totalPrice} синапсов`;

    this.closeButton.addEventListener('click', () => {
      this.events.emit('order:submited');
    });

    return this.element;
  }
};