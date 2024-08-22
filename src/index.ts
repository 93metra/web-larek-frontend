import './scss/styles.scss';

import { TPaymentMethod, IOrderDetails } from './types/index';
import { ICard, TApiSuccessResp } from './types/index';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/LarekApi';
import { CardsData } from './components/CardsData';
import { BasketModel } from './components/BasketModel';
import { OrderModel } from './components/OrderModel';
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
const order = new OrderModel(events);
const modal = new ModalView(events, modalTemplate!);

const paymentView = new PaymentView(events, paymentMethodTemplate);
const basketView = new BasketView(events, basketTemplate!);
const contactsView = new ContactsView(events, contactsViewTemplate);
const successView = new Success(events, successTemplate);

// events.onAll((event) => {
//   console.log(event.eventName, event.data);
// });

// ===================================

api.getCards().then((data) => {
  cardsData.cards = data.items;
})
.catch((err) => {
  console.error(err);
});

events.on('cards:updated', () => {
  const cardsArr = cardsData.cards.map((card) => {
    const cardInstant = new GalleryCardView(events, galleryCardTemplate);
    return cardInstant.render(card);
  })
  page.catalog = cardsArr;
});

events.on<ICard>('item:selected', (data) => {
  const previewCard = new CardPreviewView(events, previewCardTemplate);
  modal.content = previewCard.render(data, undefined, basketModel.getIds());
  modal.open();
});

events.on('modal:close', () => {
  page.locked = false;
  paymentView.clearForm();
  contactsView.clearForm();
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
  const basketItemsArr = basketModel.items.map((item, index) => {
    const basketCardInstant = new CardBasketView(events, basketCardTemplate);
    return basketCardInstant.render(item, index);
  })
  modal.content = basketView.render({
    items: basketItemsArr,
    price: basketModel.getTotalPrice(),
    isEmpty: basketModel.isEmpty()
  });
});

events.on('basket:open', () => {
  const basketItemsArr = basketModel.items.map((item, index) => {
    const basketCardInstant = new CardBasketView(events, basketCardTemplate);
    return basketCardInstant.render(item, index);
  })
  modal.content = basketView.render({
    items: basketItemsArr,
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
  order.clearOrder();
  modal.content = paymentView.render();
  events.on<IOrderDetails>('input:address', (data) => {
    order.address = data.address;
    paymentView.formIsValid(order.validateAddress(order.address), order.validatePayment(order.payment));
  })
  events.on<{paymentMethod: TPaymentMethod}>('payment:methodSelected', (data) => {
    order.payment = data.paymentMethod;
    paymentView.formIsValid(order.validateAddress(order.address), order.validatePayment(order.payment));
  })
});

events.on('goto:email', () => {
  modal.content = contactsView.render();
  events.on<IOrderDetails>('input:email', (data) => {
    order.email = data.email;
    contactsView.formIsValid(order.validateEmail(order.email), order.validatePhone(order.phone));
  })
  events.on<IOrderDetails>('input:phone', (data) => {
    order.phone = data.phone;
    contactsView.formIsValid(order.validateEmail(order.email), order.validatePhone(order.phone));
  })
});

// ===================================

events.on('submit:order', (data) => {
  api.createOrder({
    'payment': order.payment,
    'email': order.email,
    'phone': order.phone,
    'address': order.address,
    'total': basketModel.getTotalPrice(),
    'items': basketModel.getIds()
  }).then((resp: TApiSuccessResp) => {
    basketModel.clear();
    modal.content = successView.render(resp.total);
  })
  .catch((err) => {
    console.error(err);
  });
});

// ===============================

events.on('order:submited', () => {
  modal.close();
});

// ===============================
