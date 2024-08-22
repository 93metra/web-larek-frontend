import { IBasketView } from "../types";
import { IEvents } from "../components/base/events";

export class BasketView implements IBasketView {
  private events: IEvents;
  private productsList: HTMLUListElement;
  private totalPrice: HTMLSpanElement;
  private submitOrder: HTMLButtonElement;
  private basketElement: HTMLElement;

  constructor(events: IEvents, template: HTMLTemplateElement) {
    this.events = events;

    const content = template.content.cloneNode(true) as HTMLElement;

    this.productsList = content.querySelector('ul.basket__list') as HTMLUListElement;
    this.totalPrice = content.querySelector('span.basket__price') as HTMLSpanElement;
    this.submitOrder = content.querySelector('button.basket__button') as HTMLButtonElement;
    this.basketElement = content.querySelector('.basket') as HTMLElement;

    this.submitOrder.addEventListener('click', () => {
      this.events.emit('goto:payment');
    });
  }

  render(data: { items: HTMLElement[]; price: number; isEmpty: boolean }): HTMLElement {
    this.productsList.innerHTML = '';

    data.items.forEach(item => {
      this.productsList.appendChild(item);
    });

    this.totalPrice.textContent = `${data.price} синапсов`;
    this.submitOrder.disabled = data.isEmpty;

    return this.basketElement;
  }
};