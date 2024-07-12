import { EventEmitter } from '../components/base/events';
import { IFormView } from '../types';

class Form implements IFormView {
  protected events: EventEmitter;
  protected template: HTMLTemplateElement;

  constructor(events: EventEmitter, template: HTMLTemplateElement) {
    this.events = events;
    this.template = template;
  }

  render(): HTMLElement {
    throw new Error('Method not implemented');
  }

  protected createElement(): HTMLElement {
    return document.importNode(this.template.content, true).firstElementChild as HTMLElement;
  }

  protected showError(element: HTMLElement, message: string): void {
    const errorElement = element.querySelector('.form__errors');
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  protected clearError(element: HTMLElement): void {
    const errorElement = element.querySelector('.form__errors');
    if (errorElement) {
      errorElement.textContent = '';
    }
  }
}

export class PaymentView extends Form {
  constructor(events: EventEmitter, template: HTMLTemplateElement) {
    super(events, template);
  }

  render(): HTMLElement {
    const element = this.createElement();

    const addressInput = element.querySelector('input[name="address"]') as HTMLInputElement;
    const buttons = element.querySelectorAll('.order__buttons button') as NodeListOf<HTMLButtonElement>;
    const submitButton = element.querySelector('button[type="submit"]') as HTMLButtonElement;

    let payment: string | null = null;

    const validateForm = () => {
      const isAddressFilled = addressInput.value.trim() !== '';
      const isPaymentSelected = payment !== null;
      const isFormValid = isAddressFilled && isPaymentSelected;

      submitButton.disabled = !isFormValid;

      if (!isAddressFilled) {
        this.showError(element, 'Адрес доставки не введён');
      } else if (!isPaymentSelected) {
        this.showError(element, 'Способ оплаты не выбран');
      } else {
        this.clearError(element);
      }

      buttons.forEach(button => {
        if (button.name === payment) {
          button.classList.add('button_alt-active');
        } else {
          button.classList.remove('button_alt-active');
        }
      });
    };

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        payment = button.name;
        validateForm();
      });
    });

    addressInput.addEventListener('input', validateForm);

    element.addEventListener('submit', (event) => {
      event.preventDefault();
      if (addressInput.value.trim() && payment) {
        this.clearError(element);
        this.events.emit('goto:email', { payment, address: addressInput.value.trim() });
      } else {
        validateForm();
      }
    });

    return element;
  }
}

export class ContactsView extends Form {
  constructor(events: EventEmitter, template: HTMLTemplateElement) {
    super(events, template);
  }

  render(): HTMLElement {
    const element = this.createElement();

    const emailInput = element.querySelector('input[name="email"]') as HTMLInputElement;
    const phoneInput = element.querySelector('input[name="phone"]') as HTMLInputElement;
    const submitButton = element.querySelector('button[type="submit"]') as HTMLButtonElement;

    const validateForm = () => {
      const isEmailFilled = emailInput.value.trim() !== '';
      const isPhoneFilled = phoneInput.value.trim() !== '';
      const isFormValid = isEmailFilled && isPhoneFilled;

      submitButton.disabled = !isFormValid;

      if (!isEmailFilled || !isPhoneFilled) {
        this.showError(element, 'Заполните все поля');
      } else {
        this.clearError(element);
      }
    };

    emailInput.addEventListener('input', validateForm);
    phoneInput.addEventListener('input', validateForm);

    element.addEventListener('submit', (event) => {
      event.preventDefault();
      if (emailInput.value.trim() && phoneInput.value.trim()) {
        this.clearError(element);
        this.events.emit('submit:order', { email: emailInput.value.trim(), phone: phoneInput.value.trim() });
      } else {
        validateForm();
      }
    });

    return element;
  }
}