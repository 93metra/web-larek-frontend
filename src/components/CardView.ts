import { ICard } from '../types/index';
import { EventEmitter } from '../components/base/events';
import { ICardView } from '../types/index';
import { CDN_URL } from '../utils/constants';

export abstract class CardView implements ICardView {
  protected events: EventEmitter;
  private template: HTMLTemplateElement;

  constructor(eventEmitter: EventEmitter, template: HTMLTemplateElement) {
    this.events = eventEmitter;
    this.template = template;
  }

  protected createElement(): HTMLElement {
    return document.importNode(this.template.content, true).firstElementChild as HTMLElement;
  }

  protected setCategoryClass(element: HTMLElement, category: string): void {
    switch (category) {
      case "софт-скил":
        element.classList.add('card__category_soft');
        break;
      case "другое":
        element.classList.add('card__category_other');
        break;
      case "дополнительное":
        element.classList.add('card__category_additional');
        break;
      case "кнопка":
        element.classList.add('card__category_button');
        break;
      case "хард-скил":
        element.classList.add('card__category_hard');
        break;
      default:
        break;
    }
  };

  protected populateCard(element: HTMLElement, data: ICard): void {
    const categoryElement = element.querySelector('.card__category') as HTMLElement;
    const priceElement = element.querySelector('.card__price');
    const titleElement = element.querySelector('.card__title');
    const imageElement = element.querySelector('.card__image');

    if (categoryElement) {
      categoryElement.textContent = data.category;
      this.setCategoryClass(categoryElement, data.category);
    }

    if (titleElement) {
      titleElement.textContent = data.title;
    }

    if (imageElement) {
      imageElement.setAttribute('src', CDN_URL + data.image);
    }

    if (priceElement) {
      if (data.price === null) {
        priceElement.textContent = 'Бесценно';
      } else {
        priceElement.textContent = `${data.price} синапсов`;
      }
    }
  }

  abstract render(data: ICard, index?: number): HTMLElement;
};

export class GalleryCardView extends CardView {
  constructor(events: EventEmitter, template: HTMLTemplateElement) {
    super(events, template);
  }

  render(data: ICard): HTMLElement {
    const element = this.createElement();
    this.populateCard(element, data);

    element.addEventListener('click', () => {
      this.events.emit('item:selected', data);
    });

    return element;
  }
};

export class CardPreviewView extends CardView {
  constructor(events: EventEmitter, template: HTMLTemplateElement) {
    super(events, template);
  }

  render(data: ICard): HTMLElement {
    const element = this.createElement();
    this.populateCard(element, data);

    const buttonElement = element.querySelector('.card__button');
    const textElement = element.querySelector('.card__text');

    if (textElement) {
      textElement.textContent = data.description;
    }

    if (buttonElement) {
      if (data.price === null) {
        buttonElement.setAttribute('disabled', 'true');
      }
      buttonElement.addEventListener('click', () => {
        this.events.emit('basket:add', data);
      });
    }

    return element;
  }
};

export class CardBasketView extends CardView {
  constructor(events: EventEmitter, template: HTMLTemplateElement) {
    super(events, template);
  }

  render(data: ICard, index: number): HTMLElement {
    const element = this.createElement();
    const indexElement = element.querySelector('.basket__item-index');

    this.populateCard(element, data);

    const buttonElement = element.querySelector('.card__button');

    if (buttonElement) {
      buttonElement.addEventListener('click', () => {
        this.events.emit('item:delete', data);
      });
    }

    if (indexElement) {
      indexElement.textContent = (index + 1).toString();
    }

    return element;
  }
};