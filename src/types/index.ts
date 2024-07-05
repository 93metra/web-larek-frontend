export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number; 
}

export interface ICardsData {
  _cards: ICard[];
}

export interface IBasketModel {
  items: ICard[];
  add(item: ICard): void
  remove(id: string): void;
  clear(): void;
  getTotal(): number;
  getTotalPrice(): number;
  getIds(): string[];
}

export type TPaymentMethod = 'online' | 'cash';

export interface IOrderDetails {
  payment: TPaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	basket: HTMLElement;
	locked: boolean;
}

interface IModal {
	content: HTMLElement;
	closeButton: HTMLButtonElement;
}

export interface IView {
  render(data?: object): HTMLElement;
}
