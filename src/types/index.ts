export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number; 
}

export interface ICardsData {
  cards: ICard[];
  getCard(id: string): ICard | undefined;
}

export interface IBasketModel {
  add(item: ICard): void;
  remove(id: string): void;
  clear(): void;
  getTotal(): number;
  getTotalPrice(): number;
  getIds(): string[];
  isEmpty(): boolean;
  contains(id: string): boolean;
  items: ICard[];
}

export type TPaymentMethod = 'online' | 'cash';

export interface IOrderDetails {
  payment: TPaymentMethod;
  email: string;
  phone: string;
  address: string;
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	basket: HTMLElement;
	locked: boolean;
}

export interface IModal {
	content: HTMLElement;
	closeButton: HTMLButtonElement;
	open(): void;
	close(): void;
}

export interface ICardView {
  render(data: ICard, index?: number): HTMLElement;
}

export interface IBasketView {
  render(data: { items: HTMLElement[]; price: number; isEmpty: boolean }): HTMLElement;
}

export interface IFormView {
  render(): HTMLElement;
}

export interface ISuccess {
  render(total: number): HTMLElement;
}
