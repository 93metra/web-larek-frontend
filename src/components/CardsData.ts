import { ICard } from '../types';
import { IEvents } from '../components/base/events';
import { ICardsData } from '../types';

export class CardsData implements ICardsData {
  private _cards: ICard[];
  private events: IEvents;

  constructor(events: IEvents) {
    this._cards = [];
    this.events = events;
  }

  getCard(id: string): ICard | undefined {
    return this._cards.find(card => card.id === id);
  }

  get cards(): ICard[] {
    return this._cards;
  }

  set cards(cards: ICard[]) {
    this._cards = cards;
    this.events.emit('cards:updated', this._cards);
  }
};