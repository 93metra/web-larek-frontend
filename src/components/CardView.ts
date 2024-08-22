import { ICard } from '../types/index';
import { EventEmitter } from '../components/base/events';
import { ICardView } from '../types/index';
import { CDN_URL } from '../utils/constants';
import { cloneTemplate } from '../utils/utils';

export abstract class CardView implements ICardView {
  protected events: EventEmitter;
  protected element: HTMLElement;
  protected categoryElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected titleElement: HTMLElement;
  protected imageElement: HTMLElement;

  constructor(eventEmitter: EventEmitter, template: HTMLTemplateElement) {
    this.events = eventEmitter;
    this.element = cloneTemplate<HTMLElement>(template);
    this.categoryElement = this.element.querySelector('.card__category') as HTMLElement;
    this.priceElement = this.element.querySelector('.card__price') as HTMLElement;
    this.titleElement = this.element.querySelector('.card__title') as HTMLElement;
    this.imageElement = this.element.querySelector('.card__image') as HTMLElement;
  }

  protected setCategoryClass(category: string): void {
    switch (category) {
      case "софт-скил":
        this.categoryElement.classList.add('card__category_soft');
        break;
      case "другое":
        this.categoryElement.classList.add('card__category_other');
        break;
      case "дополнительное":
        this.categoryElement.classList.add('card__category_additional');
        break;
      case "кнопка":
        this.categoryElement.classList.add('card__category_button');
        break;
      case "хард-скил":
        this.categoryElement.classList.add('card__category_hard');
        break;
      default:
        break;
    }
  }

  protected populateCard(data: ICard): void {
    if (this.categoryElement) {
      this.categoryElement.textContent = data.category;
      this.setCategoryClass(data.category);
    }

    if (this.titleElement) {
      this.titleElement.textContent = data.title;
    }

    if (this.imageElement) {
      this.imageElement.setAttribute('src', CDN_URL + data.image);
    }

    if (this.priceElement) {
      if (data.price === null) {
        this.priceElement.textContent = 'Бесценно';
      } else {
        this.priceElement.textContent = `${data.price} синапсов`;
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
    this.populateCard(data);

    this.element.addEventListener('click', () => {
      this.events.emit('item:selected', data);
    });

    return this.element;
  }
};

export class CardPreviewView extends CardView {
  private buttonElement: HTMLElement;
  private textElement: HTMLElement;

  constructor(events: EventEmitter, template: HTMLTemplateElement) {
    super(events, template);
    this.buttonElement = this.element.querySelector('.card__button') as HTMLElement;
    this.textElement = this.element.querySelector('.card__text') as HTMLElement;
  }

  render(data: ICard, index?: number, basketIds?: string[]): HTMLElement {
    this.populateCard(data);

    if (this.textElement) {
      this.textElement.textContent = data.description;
    }

    if (this.buttonElement) {
      if (data.price === null) {
        this.buttonElement.setAttribute('disabled', 'true');
      } else if (basketIds?.includes(data.id)) {
        this.buttonElement.setAttribute('disabled', 'true');
      } else {
        this.buttonElement.removeAttribute('disabled');
      }

      this.buttonElement.addEventListener('click', () => {
        this.events.emit('basket:add', data);
      });
    }

    return this.element;
  }
};

export class CardBasketView extends CardView {
  private indexElement: HTMLElement;
  private buttonElement: HTMLElement;

  constructor(events: EventEmitter, template: HTMLTemplateElement) {
    super(events, template);
    this.indexElement = this.element.querySelector('.basket__item-index') as HTMLElement;
    this.buttonElement = this.element.querySelector('.card__button') as HTMLElement;
  }

  render(data: ICard, index: number): HTMLElement {
    this.populateCard(data);

    if (this.indexElement) {
      this.indexElement.textContent = (index + 1).toString();
    }

    if (this.buttonElement) {
      this.buttonElement.addEventListener('click', () => {
        this.events.emit('item:delete', data);
      });
    }

    return this.element;
  }
};