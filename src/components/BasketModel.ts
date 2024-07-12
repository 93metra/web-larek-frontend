import { ICard } from '../types';
import { IEvents } from '../components/base/events';
import { IBasketModel } from '../types';

export class BasketModel implements IBasketModel {
  private _items: ICard[];
  public events: IEvents;

  constructor(events: IEvents) {
    this._items = [];
    this.events = events;
  };

  add(item: ICard): void {
    if (!this.contains(item.id)) {
      this.items.push(item);
      this._changed();
    }
  };

  contains(id: string): boolean {
    return this._items.some(item => item.id === id);
  };

  remove(id: string): void {
    this._items = this.items.filter(item => item.id !== id);
    this._changed();
  };

  clear(): void {
    this._items = [];
  };

  getTotal(): number {
    return this.items.length;
  };

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + item.price, 0);
  };

  getIds(): string[] {
    return this.items.map(item => item.id);
  };

  get items(): ICard[] {
    return this._items;
  };

  isEmpty(): boolean {
    return this._items.length === 0;
  };

  private _changed(): void {
    this.events.emit('basket:changed', this.items);
  };
};