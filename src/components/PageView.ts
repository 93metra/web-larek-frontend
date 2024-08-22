import { IPage } from "../types";
import { IEvents } from "../components/base/events";

export class PageView implements IPage {
  private _counter: HTMLElement;
  private _catalog: HTMLElement;
  private _wrapper: HTMLElement;
  private _basket: HTMLElement;
  private _events: IEvents;

  constructor(events: IEvents, container: HTMLElement) {
    this._events = events;
    this._counter = container.querySelector('.header__basket-counter')!;
    this._catalog = container.querySelector('.gallery')!;
    this._wrapper = container.querySelector('.page__wrapper')!;
    this._basket = container.querySelector('.header__basket')!;

    this._basket.addEventListener('click', () => {
      this._events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this._counter.textContent = String(value);
  }

  set catalog(items: HTMLElement[]) {
    this._catalog.innerHTML = '';
    items.forEach(item => this._catalog.appendChild(item));
  }

  get basket(): HTMLElement {
    return this._basket;
  }

  set locked(value: boolean) {
    if (value) {
      this._wrapper.classList.add('page__wrapper_locked');
    } else {
      this._wrapper.classList.remove('page__wrapper_locked');
    }
  }
};