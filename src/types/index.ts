export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number; 
}

export interface ICardsData {
  get cards(): ICard[];
  set cards(cards: ICard[]);
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

export interface IOrderModel {
  set payment(payment: TPaymentMethod); 
  set email(email: string);
  set phone(phone: string);
  set address(address: string);

  get order(): IOrderDetails;
  get payment(): TPaymentMethod;
  get email(): string;
  get phone(): string;
  get address(): string;

  validatePayment(payment: TPaymentMethod): boolean;
  validateEmail(email: string): boolean;
  validatePhone(phone: string): boolean;
  validateAddress(address: string): boolean;

  clearOrder(): void;
}

export type TPaymentMethod = '' | 'card' | 'cash';

export interface IOrderDetails {
  payment: TPaymentMethod;
  email: string;
  phone: string;
  address: string;
}

export interface IPage {
  set counter(value: number);
  set catalog(items: HTMLElement[]);
  set locked(value: boolean);
  get basket(): HTMLElement;
}

export interface IModal {
  set content(value: HTMLElement);
	open(): void;
	close(): void;
}

export interface ICardView {
  render(data: ICard, index?: number, basketIds?: string[]): HTMLElement;
}

export interface IBasketView {
  render(data: { items: HTMLElement[]; price: number; isEmpty: boolean }): HTMLElement;
}

export interface IFormView {
  render(...args: any[]): HTMLElement;
}

export interface ISuccess {
  render(total: number): HTMLElement;
}

export type TApiSuccessResp = {id: string, total: number}