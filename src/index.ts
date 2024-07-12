import './scss/styles.scss';

import { TPaymentMethod } from './types/index';
import { ICard } from './types/index';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/LarekApi';
import { CardsData } from './components/CardsData';
import { BasketModel } from './components/BasketModel';
import { OrderDetails } from './components/OrderModel';
import { PageView } from './components/PageView';
import { ModalView } from './components/ModalView';
import { BasketView } from './components/BasketView';
import { GalleryCardView, CardPreviewView, CardBasketView } from './components/CardView';
import { PaymentView } from './components/Form';
import { ContactsView } from './components/Form';
import { Success } from './components/Success';




const modalTemplate = document.getElementById('modal-container');
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const galleryCardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const previewCardTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const basketCardTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
const paymentMethodTemplate = document.getElementById('order') as HTMLTemplateElement;
const contactsViewTemplate = document.getElementById('contacts') as HTMLTemplateElement;
const successTemplate = document.getElementById('success') as HTMLTemplateElement;

const events = new EventEmitter();
const api = new LarekApi();
const page = new PageView(events, document.body);
const cardsData = new CardsData(events);
const basketModel = new BasketModel(events);
const order = new OrderDetails(events);

const modal = new ModalView(events, modalTemplate!);
const galleryCard = new GalleryCardView(events, galleryCardTemplate);
const previewCard = new CardPreviewView(events, previewCardTemplate);
const basketCard = new CardBasketView(events, basketCardTemplate);
const paymentView = new PaymentView(events, paymentMethodTemplate);
const basketView = new BasketView(events, basketTemplate!);
const contactsView = new ContactsView(events, contactsViewTemplate);
const successView = new Success(events, successTemplate);

api.getCards().then((data) => {
  cardsData.cards = data.items;
});

events.on('cards:updated', () => {
  page.catalog = cardsData.cards.map(card => galleryCard.render(card))
});

events.on<ICard>('item:selected', (data) => {
  modal.content = previewCard.render(data);
  modal.open();
});

events.on('modal:close', () => {
  page.locked = false;
});

events.on('modal:open', () => {
  page.locked = true;
});

// ===================================

events.on<ICard>('basket:add', (data) => {
  basketModel.add(data);
  modal.close();
});

events.on('basket:changed', (data) => {
  page.counter = basketModel.getTotal();
  modal.content = basketView.render({
    items: basketModel.items.map((item, index) => basketCard.render(item, index)),
    price: basketModel.getTotalPrice(),
    isEmpty: basketModel.isEmpty()
  });  
});

events.on('basket:open', () => {
  modal.content = basketView.render({
    items: basketModel.items.map((item, index) => basketCard.render(item, index)),
    price: basketModel.getTotalPrice(),
    isEmpty: basketModel.isEmpty()
  });  
  modal.open();
});

events.on<ICard>('item:delete', (data) => {
  basketModel.remove(data.id);
});

// ===================================

events.on('goto:payment', () => {
  modal.content = paymentView.render();
  
});

events.on<{payment: TPaymentMethod, address: string}>('goto:email', (data) => {
  order.payment = data.payment;
  order.address = data.address;
  modal.content = contactsView.render();
});

// ===================================

events.on<{email: string, phone: string}>('submit:order', (data) => {
  order.email = data.email;
  order.phone = data.phone;

  api.createOrder({
    'payment': order.payment,
    'email': order.email,
    'phone': order.phone,
    'address': order.address,
    'total': basketModel.getTotalPrice(),
    'items': basketModel.getIds()
  }).then((resp) => {
    // console.log(resp);
    modal.content = successView.render(basketModel.getTotalPrice());
    basketModel.clear();
    page.counter = basketModel.getTotal();
  })
});

// ===============================

events.on('order:submited', () => {
  modal.close();
});

// ===============================

