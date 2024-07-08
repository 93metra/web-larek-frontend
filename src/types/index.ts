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
  getCard(id: string): ICard;
}

export interface IBasketModel {
  add(item: ICard): void;
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
}

export interface IView {
  render(template: HTMLTemplateElement): HTMLElement;
}

export type TemplateType = 'catalog' | 'preview' | 'basket';
