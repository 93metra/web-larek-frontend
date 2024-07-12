import { IPage } from "../types";
import { IEvents } from "../components/base/events";

export class PageView implements IPage {
  private _counter: HTMLElement;
  private _catalog: HTMLElement;
  private _wrapper: HTMLElement;
  public basket: HTMLElement;
  public events: IEvents;

  constructor(events: IEvents, container: HTMLElement) {
    this.events = events;
    this._counter = container.querySelector('.header__basket-counter')!;
    this._catalog = container.querySelector('.gallery')!;
    this._wrapper = container.querySelector('.page__wrapper')!;
    this.basket = container.querySelector('.header__basket')!;
    
    this.basket.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this._counter.textContent = String(value);
  }

  set catalog(items: HTMLElement[]) {
    this._catalog.innerHTML = '';
    items.forEach(item => this._catalog.appendChild(item));
  }

  set locked(value: boolean) {
    if (value) {
      this._wrapper.classList.add('page__wrapper_locked');
    } else {
      this._wrapper.classList.remove('page__wrapper_locked');
    }
  }
};
