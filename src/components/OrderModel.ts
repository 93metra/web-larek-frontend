import { IEvents } from '../components/base/events';
import { IOrderModel, IOrderDetails, TPaymentMethod } from '../types';

export class OrderModel implements IOrderModel {
  private _orderDetails: IOrderDetails;
  private events: IEvents;

  constructor(events: IEvents) {
    this._orderDetails = { payment: '', email: '', phone: '', address: '' };
    this.events = events;
  }

  set payment(payment: TPaymentMethod) {
    this.validatePayment(payment);
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

  validatePayment(payment: TPaymentMethod): boolean {
    if (payment !== 'cash' && payment !== 'card') {
      return false;
    }
    return true;
  }

  validateEmail(email: string): boolean {
    if (email.trim().length === 0) {
      return false;
    }
    return true;
  }

  validatePhone(phone: string): boolean {
    if (phone.trim().length === 0) {
      return false;
    }
    return true;
  }

  validateAddress(address: string): boolean {
    if (address.trim().length === 0) {
      return false;
    }
    return true;
  }

  clearOrder(): void {
    this.address = '';
    this.email = '';
    this.phone = '';
    this.payment = '';
  }
};