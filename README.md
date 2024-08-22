# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных:

-Интерфейс для данных каточки товара (в таком виде данные приходят с сервера).
```
interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number; 
}
```

-Интерфейс для модели данных карточек(товаров).
```
interface ICardsData {
  set cards(cards: ICard[]);
  get cards(): ICard[];
  getCard(id: string): ICard | undefined;
}
```

-Интерфейс для модели данных корзины.
```
interface IBasketModel {
  add(item: ICard): void;
  remove(id: string): void;
  clear(): void;
  getTotal(): number;
  getTotalPrice(): number;
  getIds(): string[];
  isEmpty(): boolean;
  contains(id: string): boolean;
  items: ICard[]; // добавлен геттер для items
}
```

-Тип данных метода оплаты.
```
type TPaymentMethod = '' | 'card' | 'cash';
```

-Интерфейс данных заказа отправляемых на сервер.
```
interface IOrderDetails {
  payment: TPaymentMethod;
  email: string;
  phone: string;
  address: string;
}
```

-Интерфейс для модели данных заказа.
```
interface IOrderModel {
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
```
-Интерфейс для отображения главной страницы.
```
interface IPage {
  set counter(value: number);
  set catalog(items: HTMLElement[]);
  set locked(value: boolean);
  get basket(): HTMLElement;
}
```

-Интерфейс для отображения модалки.
```
interface IModal {
  set content(value: HTMLElement)
	open(): void;
	close(): void;
}
```

-Интерфейс для отображения карточки.
```
interface ICardView {
  render(data: ICard, index?: number, basketIds?: string[]): HTMLElement;
}
```

-Интерфейс для отображения корзины.
```
interface IBasketView {
  render(data: { items: HTMLElement[]; price: number; isEmpty: boolean }): HTMLElement;
}
```

-Интерфейс для отображения форм.
```
interface IFormView {
  render(...args: any[]): HTMLElement;
}
```

-Интерфейс для отображения успешного заказа.
```
interface ISuccess {
  render(total: number): HTMLElement;
}
```

-Тип данных ответа сервера.
```
type TApiSuccessResp = {id: string, total: number}
```

## Архитектура приложения
Код приложения разделен на слои согласно парадигме MVP:
- слой данных(Model), отвечает за хранение и изменение данных.
- слой представления(View), отвечает за отображение данных на странице.
- презентер(Presenter), отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс LarekApi
Наследует класс Api и отвечает за работу апи непосредственно нашего приложения.

Методы:
- getCards(): Promise<ApiListResponse<ICard>> - запрашивает и возвращает с сервера массив товаров в формате ICard и их количество.
- createOrder(order: {payment: string, email: string, phone: string, address: string, total: number, items: string[]}): Promise<object> - отправляет на сервер заказ (объект в формате в котором сервер принимает заказ)

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий. 

Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие    

### Слой данных

#### Класс CardsData
Реализует интерфейс ICardsData.
Отвечает за хранение и логику работы с данными карточек(товаров) загруженных с сервера.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- private _cards: ICard[] - массив объектов карточек.
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Методы:
- getCard(id: string): ICard - возвращает карточку по ее id
- get cards(): ICard[] - возвращает массив карточек _cards
- set cards(cards: ICard[]) - устанавливает массив карточек _cards и вызывает событие 'cards:updated' передавая массив карточек

#### Класс BasketModel
Реализует интерфейс IBasketModel.
Класс отвечает за хранение и логику работы с товарами в корзине.
Конструктор класса принимает инстанс брокера событий.

В полях класса хранятся следующие данные:

- private _items: ICard[] - хранит товары, добавленные в корзину.
- private events: IEvents - экземпляр класса EventEmitter для инициации событий при изменении данных.

Методы:

- add(item: ICard): void - Добавляет товар в корзину, если товар с таким же id отсутствует. Вызывает _changed() для уведомления об изменении корзины.
- remove(id: string): void - Удаляет товар из корзины по его id. Вызывает _changed() для уведомления об изменении корзины.
- clear(): void - Удаляет все товары из корзины. Вызывает _changed() для уведомления об изменении корзины.
- getTotal(): number - Возвращает количество товаров в корзине.
- getTotalPrice(): number - Возвращает общую стоимость товаров в корзине.
- getIds(): string[] - Возвращает массив с id товаров, находящихся в корзине.
- contains(id: string): boolean - Проверяет, содержится ли товар с указанным id в корзине.
- get items(): ICard[] - Возвращает массив текущих товаров в корзине.
- isEmpty(): boolean - Проверяет, пуста ли корзина.
- private _changed(): void - Защищенный метод, который инициирует событие 'basket:changed', передавая текущие товары корзины.

#### Класс OrderModel
Реализует интерфейс IOrderModel.
Класс отвечает за хранение и заполнение, объекта с данными заказа (только данные клиента, список товаров и сумма заказа будут браться из модели корзины).

В полях класса хранятся следующие данные:
- private _orderDetails: IOrderDetails; - Хранит даные заказа.
- private events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Методы:
- set payment(payment: TPaymentMethod) - Вызывает свой валидатор. Устанавливает способ оплаты. 
- set email(email: string) - Вызывает свой валидатор. Устанавливает почту.
- set phone(phone: string) - Вызывает свой валидатор. Устанавливает телефон.
- set address(address: string) - Вызывает свой валидатор. Устанавливает адрес доставки.
- get payment(): TPaymentMethod - Возвращает способ оплаты.
- get email(): string - Возвращает почту.
- get phone(): string - Возвращает телефон.
- get address(): string - Возвращает адрес доставки.
- get order(): IOrderDetails - Возвращает данные заказа.

- validatePayment(payment: TPaymentMethod): boolean - валидатор способа оплаты.
- validateEmail(email: string): boolean - валидатор email.
- validatePhone(phone: string): boolean - валидатор телефона.
- validateAddress(address: string): boolean - валидатор адреса.

- clearOrder(): void - очищает данные заказа.

### Слой отображения

#### Класс PageView
Реализует интерфейс IPage.
Класс отвечает за отображение страницы и управление элементами DOM, связанными с представлением страницы.
Конструктор класса принимает экземпляр брокера событий и контейнер элемента страницы.

В полях класса хранятся следующие данные:

- private _counter: HTMLElement - элемент DOM, отображающий количество товаров в корзине.
- private _catalog: HTMLElement - элемент DOM, представляющий каталог товаров.
- private _wrapper: HTMLElement - элемент DOM, являющийся контейнером для всей страницы.
- private _basket: HTMLElement - элемент DOM, представляющий корзину.
- private _events: IEvents - экземпляр класса EventEmitter для инициации событий при взаимодействии с элементами страницы.

Методы:

- set counter(value: number) - Устанавливает количество товаров в корзине.
- set catalog(items: HTMLElement[]) - Устанавливает список карточек товаров.
- get basket(): HTMLElement -Возврвщвет DOM элемент, представляющий корзину.
- set locked(value: boolean) - Блокирует и разблокирует возможность прокрутки страницы.

#### Класс ModalView
Реализует интерфейс IModal.
Класс отвечает за управление модальным окном, включая его открытие и закрытие, а также обработку событий.

Конструктор класса принимает инстанс брокера событий и контейнер модального окна.

В полях класса хранятся следующие данные:

- private _content: HTMLElement - элемент, содержащий контент модального окна.
- private _container: HTMLElement - контейнер, в котором находится модальное окно.
- private closeButton: HTMLButtonElement - кнопка для закрытия модального окна.
- private events: IEvents - экземпляр класса EventEmitter для инициации событий при изменении состояния модального окна.

Методы:

- set content(value: HTMLElement): void - Устанавливает контент модального окна. Заменяет текущий контент на новый.
- open(): void - Открывает модальное окно. Добавляет CSS класс 'modal_active' к контейнеру и вызывает emitOpenEvent() для уведомления об открытии.
- close(): void - Закрывает модальное окно. Удаляет CSS класс 'modal_active' из контейнера, очищает контент и вызывает emitCloseEvent() для уведомления о закрытии.
- private onContainerClick(event: MouseEvent): void - Обработчик событий клика на контейнере. Закрывает модальное окно, если клик произошел вне области контента.
- private emitCloseEvent(): void - Инициирует событие 'modal:close'.
- private emitOpenEvent(): void - Инициирует событие 'modal:open'.

#### Класс CardView
Реализует интерфейс ICardView.
Абстрактный класс, реализующий интерфейс ICardView. Класс служит основой для отображения карточек товаров. Содержит общую логику для всех типов карточек.
Конструктор класса принимает экземпляр брокера событий и шаблон карточки.

В полях класса хранятся следующие данные:

- protected events: EventEmitter - экземпляр класса EventEmitter для работы с событиями.
- protected element: HTMLElement - элемент карточки, клонированный из шаблона.
- protected categoryElement: HTMLElement - элемент для отображения категории товара.
- protected priceElement: HTMLElement - элемент для отображения цены товара.
- protected titleElement: HTMLElement - элемент для отображения названия товара.
- protected imageElement: HTMLElement - элемент для отображения изображения товара.

Методы:

- protected setCategoryClass(category: string): void - устанавливает CSS-класс категории товара в зависимости от её значения.
- protected populateCard(data: ICard): void - заполняет элементы карточки данными товара (category, title, image, price).
- abstract render(data: ICard, index?: number): HTMLElement - абстрактный метод для отрисовки карточки, реализуется в дочерних классах.

#### Класс GalleryCardView
Наследуется от CardView.
Класс отвечает за отрисовку карточек в галерее.

Методы:

- render(data: ICard): HTMLElement - переопределяет метод из CardView, заполняя элемент данными карточки и добавляя обработчик события клика, который инициирует событие 'item:selected'.

#### Класс CardPreviewView
Наследуется от CardView. Класс отвечает за предварительный просмотр карточек товаров и добавление их в корзину.

В полях класса хранятся следующие данные:

- private buttonElement: HTMLElement - кнопка для добавления товара в корзину.
- private textElement: HTMLElement - элемент для отображения описания товара.

Методы:

- render(data: ICard, index?: number, basketIds?: string[]): HTMLElement - отрисовывает карточку товара, отображает описание и управляет состоянием кнопки в зависимости от наличия товара в корзине. Устанавливает обработчик события клика на кнопку, который инициирует событие 'basket:add'.

#### Класс CardBasketView
Наследуется от CardView.
Класс отвечает за отрисовку карточек товаров в корзине.

В полях класса хранятся следующие данные:

- private indexElement: HTMLElement - элемент для отображения порядкового номера товара в корзине.
- private buttonElement: HTMLElement - кнопка для удаления товара из корзины.

Методы:

- render(data: ICard, index: number): HTMLElement - отрисовывает карточку товара, отображает порядковый номер товара в корзине и устанавливает обработчик события клика на кнопку, который инициирует событие 'item:delete'.

#### Класс BasketView
Реализует интерфейс IBasketView.
Класс отвечает за отображение содержимого корзины и управление элементами пользовательского интерфейса.
Конструктор класса принимает инстант брокера событий и шаблон HTMLTemplateElement.

В полях класса хранятся следующие данные:

- private events: IEvents - экземпляр класса EventEmitter для управления событиями пользовательского интерфейса.
- private productsList: HTMLUListElement - элемент списка для отображения товаров в корзине.
- private totalPrice: HTMLSpanElement - элемент для отображения общей стоимости товаров в корзине.
- private submitOrder: HTMLButtonElement - кнопка для оформления заказа.
- private basketElement: HTMLElement - корневой элемент корзины.

Методы:

- render(data: { items: HTMLElement[]; price: number; isEmpty: boolean }): HTMLElement - Отображает товары в корзине, обновляет общую стоимость и состояние кнопки оформления заказа.
Очищает текущий список товаров.
Добавляет новые товары в список.
Обновляет текстовое содержание элемента общей стоимости.
Включает или отключает кнопку оформления заказа в зависимости от наличия товаров в корзине.
Возвращает обновленный элемент корзины.

#### Класс Form
Реализует интерфейс IFormView.
Класс отвечает за базовую логику работы с формами.
Конструктор класса принимает экземпляр брокера событий и шаблон.

В полях класса хранятся следующие данные:

- protected events: EventEmitter - экземпляр класса EventEmitter, используемый для инициации событий.
- protected template: HTMLTemplateElement - шаблон для создания формы.
- protected element: HTMLElement - элемент формы, созданный на основе шаблона.
- protected submitButton: HTMLButtonElement - кнопка отправки формы.

Методы:

- render(...args: any[]): HTMLElement - метод отрисовки формы, возвращает элемент формы. В базовой реализации не реализован.
- protected showError(message: string): void - метод, выводящий сообщение об ошибке в элемент формы.
- protected clearError(): void - метод, очищающий сообщение об ошибке.
- clearForm(): void - очищает все поля формы и блокирует кнопку отправки.

#### Класс PaymentView
Наследуется от Form.
Класс отвечает за работу с формой оплаты.
Конструктор класса принимает экземпляр брокера событий и шаблон.

В полях класса хранятся следующие данные:

- private addressInput: HTMLInputElement - поле для ввода адреса доставки.
- private buttons: NodeListOf<HTMLButtonElement> - кнопки выбора метода оплаты.
- private payment: string | null - выбранный метод оплаты (по умолчанию null).

Методы:

- render(paymentIsValid: boolean = false): HTMLElement - метод отрисовки формы оплаты. Добавляет обработчики событий для ввода адреса и выбора метода оплаты, а также для отправки формы. Блокирует кнопку отправки, если данные некорректны.
- formIsValid(paymentIsValid: boolean, adressIsValid: boolean): void - Разблокирует или блокирует кнопку отправки в зависимости от состояния формы.
- private updateButtonState(): void - обновляет состояние кнопок выбора метода оплаты, выделяя активную кнопку.

#### Класс ContactsView
Наследуется от Form.
Класс отвечает за работу с формой контактов.
Конструктор класса принимает экземпляр брокера событий и HTML-шаблон.

В полях класса хранятся следующие данные:

- private emailInput: HTMLInputElement - поле для ввода email.
- private phoneInput: HTMLInputElement - поле для ввода телефона.

Методы:

- render(phoneIsValid: boolean = false, emailIsValid: boolean = false): HTMLElement - метод отрисовки формы контактов. Добавляет обработчики событий для ввода email и телефона, а также для отправки формы. Блокирует кнопку отправки, если данные некорректны.
- formIsValid(phoneIsValid: boolean, emailIsValid: boolean): void - Разблокирует или блокирует кнопку отправки в зависимости от состояния формы.

#### Класс Success
Отображение сообщения об успешной оплате.
Конструктор класса принимает инстант брокера событий и (container: HTMLElement) для определения в нем нужных элементов.
На кнопку за новыми покупками уснанавливается слушатель клика инициирующий событие ('order:submited').

В полях класса хранятся следующие данные:
- private events: EventEmitter - экземпляр, реализующий интерфейс IEvents, используемый для управления событиями.
- private priceElement: HTMLElement - списанная сумма
- private closeButton: HTMLButtonElement - кнопка за новыми покупками
- private element: HTMLElement - контейнер элемента
- private template: HTMLTemplateElement - шаблон для клонирования элементов карточки

Методы:
- render(totalPrice: number): HTMLElement - возвращает готовый элемент.

### Презентер
Модели и отображение будут связываться с использованием событийно-ориентированного подхода, сам код презентера не будет выделен в отдельный класс, а будет размещен в основном скрипте приложения index.ts.
Далее описан сценарий работы приложения и применяемые события:

- При загрузке сайта:
-Создаются экземпляры классов: LarekApi, EventEmitter, CardsData, BasketModel, OrderDetails, PageView, ModalView.
-С сервера запрашивается список товаров и сохраняется в модель CardsData в следствии чего вызывается событие 'cards:updated' передавая массив карточек. На основании переданного массива создается массив элементов карточек товара (СatalogCardVeiw) и вставляется в список товаров внутри (PageView).

- Нажатие на карточку товара в каталоге (СatalogCardVeiw) вызывает событие 'item:selected' передавая данные товара. С использованием этих данных (CardPreviewVeiw) отрисовывает элемент предпросмотра товара и вставляется в мадалку (ModalView), после чего, модалка отображается на экране.

- Нажатие на кнопку добавления в корзину вызывает событие 'basket:add' передавая данные товара. Данные сохраняются в модель корзины (BasketModel). Модальное окно закрывается.

- При вызове функций добавления товара и удаления товара вызывается событие 'basket:changed' передавая id соответствующего товара. Реакцией на это событие является: Соответствующее изменение в модели данных корзины (BasketModel), перерисовка отображения корзины (BasketView) и обнавление счетчика товаров в корзине на главной странице.

- Нажатие на корзину вызывает событие 'basket:open'. Используя данные и методы модели корзины отрисовывается элемент корзины (BasketView), отрисовываются элементы корзины (BasketItemView), вставляются в корзину, после чего, корзина вставляется в модалку и отображается на экране.

- Нажатие на кнопку удаления товара из корзины вызывает событие 'item:delete' передавая id соответствующего товара, иодель корзины удаляет соответствующий товар и вызывается событие 'basket:changed' описанное выше.

- Нажатие на кнопку оформления заказа вызывает событие 'goto:payment'. Отрисовывается элемент выбора метода оплаты (PaymentView) и вставляется в модалку.

- Нажатие на кнопку далее вызывает событие 'goto:email' передавая способ оплаты и адрес. Эти данные сохраняются в модель зказа (OrderDetails). Отрисовывается элемент ввода почты и телефона (ContactsView) и вставляется в модалку.

- Нажатие на кнопку оплатить вызывает событие 'submit:order' передавая почту и телефон. Эти данные сохраняются в модель зказа (OrderDetails). После чего, в методе отправки заказа на сервер (LarekApi) собирается объект с данными заказа. Они берутся из модели (OrderDetails) и модели корзины (BasketModel). Заказ отравляется на сервер. Корзина очищается. Отрисовывается сообщение об успешной оплате (Success) и вставляется в модалку.

- Нажатие на кнопку за новыми покупками вызывает событие 'order:submited'. Модальное окно закрывается. 