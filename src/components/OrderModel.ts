import { IEvents } from '../components/base/events';
import { IOrderDetails, TPaymentMethod } from '../types';

export class OrderDetails {
  private _orderDetails: IOrderDetails;
  public events: IEvents;

  constructor(events: IEvents) {
    this._orderDetails = { payment: 'cash', email: '', phone: '', address: '' };
    this.events = events;
  }

  set payment(payment: TPaymentMethod) {
    // this.validatePayment(payment);
    this._orderDetails.payment = payment;
    this.events.emit('orderUpdated', this._orderDetails);
  }

  set email(email: string) {
    this.validateEmail(email);
    this._orderDetails.email = email;
    this.events.emit('orderUpdated', this._orderDetails);
  }

  set phone(phone: string) {
    this.validatePhone(phone);
    this._orderDetails.phone = phone;
    this.events.emit('orderUpdated', this._orderDetails);
  }

  set address(address: string) {
    this.validateAddress(address);
    this._orderDetails.address = address;
    this.events.emit('orderUpdated', this._orderDetails);
  }

  get order(): IOrderDetails {
    return this._orderDetails;
  }

  get payment(): TPaymentMethod {
    return this._orderDetails.payment;
  }

  get email(): string {
    return this._orderDetails.email;
  }

  get phone(): string {
    return this._orderDetails.phone;
  }

  get address(): string {
    return this._orderDetails.address;
  }

  private validatePayment(payment: TPaymentMethod): void {
    if (payment !== 'cash' && payment !== 'online') {
      throw new Error('Invalid payment method');
    }
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email address');
    }
  }

  private validatePhone(phone: string): void {
    if (!phone.startsWith('+')) {
      throw new Error('Phone number must start with a "+"');
    }
  }

  private validateAddress(address: string): void {
    if (address.trim().length === 0) {
      throw new Error('Address cannot be empty');
    }
  }
};