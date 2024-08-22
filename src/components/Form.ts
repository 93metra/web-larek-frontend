import { EventEmitter } from '../components/base/events';
import { cloneTemplate } from '../utils/utils';
import { IFormView } from '../types/index';

class Form implements IFormView {
  protected events: EventEmitter;
  protected template: HTMLTemplateElement;
  protected element: HTMLElement;
  protected submitButton: HTMLButtonElement;

  constructor(events: EventEmitter, template: HTMLTemplateElement) {
    this.events = events;
    this.template = template;
    this.element = cloneTemplate(template);
    this.submitButton = this.element.querySelector('button[type="submit"]') as HTMLButtonElement;
  }

  render(...args: any[]): HTMLElement {
    console.log('Method not implemented');
    return this.element;
  }

  protected showError(message: string): void {
    const errorElement = this.element.querySelector('.form__errors');
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  protected clearError(): void {
    const errorElement = this.element.querySelector('.form__errors');
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  public clearForm(): void {
    const inputs = this.element.querySelectorAll('input');
    inputs.forEach(input => input.value = '');
    this.submitButton.disabled = true;

  }
};

export class PaymentView extends Form {
  private addressInput: HTMLInputElement;
  private buttons: NodeListOf<HTMLButtonElement>;
  private payment: string | null = null;

  constructor(events: EventEmitter, template: HTMLTemplateElement) {
    super(events, template);
    this.addressInput = this.element.querySelector('input[name="address"]') as HTMLInputElement;
    this.buttons = this.element.querySelectorAll('.order__buttons button') as NodeListOf<HTMLButtonElement>;
  }

  render(paymentIsValid: boolean = false, adressIsValid: boolean = false): HTMLElement {
    this.submitButton.disabled = !paymentIsValid && !adressIsValid;

    if (!paymentIsValid) {
      this.showError('Введите адрес доставки');
    }

    this.addressInput.addEventListener('input', () => {
      this.events.emit('input:address', { address: this.addressInput.value.trim() });
    });

    this.buttons.forEach(button => {
      button.addEventListener('click', () => {
        this.payment = button.name;
        this.updateButtonState();
        this.events.emit('payment:methodSelected', { paymentMethod: this.payment });
      });
    });

    this.element.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('goto:email');
    });

    return this.element;
  }

  public formIsValid(paymentIsValid: boolean, adressIsValid: boolean): void {
    const formIsValid = paymentIsValid && adressIsValid;
    this.submitButton.disabled = !formIsValid;

    if (formIsValid) {
      this.clearError();
    } else {
      this.showError('Введите адрес доставки');
    }
  }

  private updateButtonState(): void {
    this.buttons.forEach(button => {
      if (button.name === this.payment) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    });
  }
};

export class ContactsView extends Form {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(events: EventEmitter, template: HTMLTemplateElement) {
    super(events, template);
    this.emailInput = this.element.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = this.element.querySelector('input[name="phone"]') as HTMLInputElement;
  }

  render(phoneIsValid: boolean = false, emailIsValid: boolean = false): HTMLElement {
    const formIsValid = phoneIsValid && emailIsValid;
    this.submitButton.disabled = !formIsValid;

    if (!formIsValid) {
      this.showError('Оба поля должны быть заполнены');
    }

    this.emailInput.addEventListener('input', () => {
      this.events.emit('input:email', { email: this.emailInput.value.trim() });
    });

    this.phoneInput.addEventListener('input', () => {
      this.events.emit('input:phone', { phone: this.phoneInput.value.trim() });
    });

    this.element.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('submit:order');
    });

    return this.element;
  }

  public formIsValid(phoneIsValid: boolean, emailIsValid: boolean): void {
    const formIsValid = phoneIsValid && emailIsValid;
    this.submitButton.disabled = !formIsValid;

    if (formIsValid) {
      this.clearError();
    } else {
      this.showError('Оба поля должны быть заполнены');
    }
  }
};