interface Product {
	id: string;
	category: string;
	title: string;
	image: string;
	description: string;
	price: number;
}

interface CartItem {
	id: string;
	title: string;
	price: number;
	orderNumber: number;
}

interface OrderDetails {
	email: string;
	phone: string;
	paymentMethod: string;
	deliveryAddress: string;
	items: CartItem[];
}

// добавил импорт чтобы не было ошибки
import { Api, ApiListResponse } from '../components/base/api';
class ApiService {
	private api: Api;

	constructor(api: Api) {
		this.api = api;
	}

	getProducts(): Promise<ApiListResponse<Product>> {
		return this.api.get('/product');
	}

	submitOrder(orderDetails: OrderDetails): Promise<void> {
		return this.api.post('/order', orderDetails);
	}
}

class CartService {
	private items: CartItem[] = [];

	private getNextOrderNumber(): number {
		return this.items.length > 0
			? Math.max(...this.items.map((item) => item.orderNumber)) + 1
			: 1;
	}

	addToCart(product: Product): void {
		if (!this.items.some((item) => item.id === product.id)) {
			const newCartItem: CartItem = {
				id: product.id,
				title: product.title,
				price: product.price,
				orderNumber: this.getNextOrderNumber(),
			};
			this.items.push(newCartItem);
		}
	}

	removeFromCart(productId: string): void {
		this.items = this.items.filter((item) => item.id !== productId);
		this.items.forEach((item, index) => {
			item.orderNumber = index + 1;
		});
	}

	getCartItems(): CartItem[] {
		return this.items;
	}

	clearCart(): void {
		this.items = [];
	}
}

class Validator {
	static validateAddress(address: string): boolean {
		return address.length > 5;
		// Добавлена рандомная проверка для примера
	}

	static validateEmail(email: string): boolean {
		const re = /\S+@\S+\.\S+/;
		return re.test(email);
		// Добавлена рандомная проверка для примера
	}

	static validatePhone(phone: string): boolean {
		const re = /^\+?[1-9]\d{1,14}$/;
		return re.test(phone);
		// Добавлена рандомная проверка для примера
	}
}

class MainPage {
	constructor(
		private apiService: ApiService,
		private cartService: CartService
	) {
		this.init();
	}

	init() {
		this.apiService
			.getProducts()
			.then((response) => {
				this.displayProducts(response.items);
			})
			.catch((error) => {
				this.showError(error);
			});
	}

	displayProducts(products: Product[]): void {
		// Логика отображения списка товаров на странице
	}

	updateCartView(items: CartItem[]): void {
		// Логика обновления отображения корзины
	}

	showError(error: string): void {
		// Логика отображения сообщения об ошибке
	}

	showSuccess(message: string): void {
		// Логика отображения сообщения об успешном заказе
	}
}

// ==========================================================================

class ProductCard {
	constructor(private product: Product) {}

	render(): HTMLElement {
		const template = document.getElementById(
			'card-catalog'
		) as HTMLTemplateElement;
		const card = template.content.firstElementChild?.cloneNode(
			true
		) as HTMLElement;

		if (card) {
			card.querySelector('.card__title')!.textContent = this.product.title;
			card
				.querySelector('.card__image')!
				.setAttribute('src', this.product.image);
			card.querySelector(
				'.card__price'
			)!.textContent = `${this.product.price} синапсов`;

			card.addEventListener('click', () => {
				new ProductDetailsModal(this.product, cartService).open();
			});
		}

		return card;
	}
}

class BaseModal {
	protected modal: HTMLElement;

	constructor() {
		this.modal = document.getElementById('modal-container') as HTMLElement;
		this.modal.classList.add('modal');
	}

	open() {
		this.modal.classList.add('modal_active');
	}

	close() {
		this.modal.classList.remove('modal_active');
	}

	protected createCloseButton(): HTMLElement {
		const closeButton = this.modal.querySelector(
			'.modal__close'
		) as HTMLElement;
		closeButton.addEventListener('click', () => this.close());
		return closeButton;
	}

	protected handleOutsideClick(event: MouseEvent): void {
		if (event.target === this.modal) {
			this.close();
		}
	}

	protected setupModal(): void {
		this.modal.addEventListener('click', (event: MouseEvent) =>
			this.handleOutsideClick(event)
		);
		this.createCloseButton();
	}
}

class ProductDetailsModal extends BaseModal {
	constructor(private product: Product, private cartService: CartService) {
		super();
		this.setupModal();
		this.render();
		this.open();
	}

	private render(): void {
		const template = document.getElementById(
			'card-preview'
		) as HTMLTemplateElement;
		const content = template.content.firstElementChild?.cloneNode(
			true
		) as HTMLElement;

		if (content) {
			content.querySelector('.card__title')!.textContent = this.product.title;
			content.querySelector('.card__text')!.textContent =
				this.product.description;
			content
				.querySelector('.card__image')!
				.setAttribute('src', this.product.image);
			content.querySelector(
				'.card__price'
			)!.textContent = `${this.product.price} синапсов`;

			content
				.querySelector('.card__button')
				?.addEventListener('click', () => this.handleBuyClick());
		}

		const modalContent = this.modal.querySelector(
			'.modal__content'
		) as HTMLElement;
		modalContent.innerHTML = '';
		modalContent.appendChild(content);
	}

	private handleBuyClick(): void {
		this.cartService.addToCart(this.product);
		this.close();
	}
}

class CartModal extends BaseModal {
	constructor(private cartService: CartService) {
		super();
		this.setupModal();
		this.render();
		this.open();
	}

	private render(): void {
		const template = document.getElementById('basket') as HTMLTemplateElement;
		const content = template.content.firstElementChild?.cloneNode(
			true
		) as HTMLElement;

		if (content) {
			const cartItemsContainer = content.querySelector(
				'.basket__list'
			) as HTMLElement;
			cartItemsContainer.innerHTML = this.cartService
				.getCartItems()
				.map(
					(item) => `
        <li class="basket__item card card_compact">
          <span class="basket__item-index">${item.id}</span>
          <span class="card__title">${item.title}</span>
          <span class="card__price">${item.price} синапсов</span>
          <button class="basket__item-delete card__button" data-id="${item.id}" aria-label="удалить"></button>
        </li>
      `
				)
				.join('');

			content
				.querySelectorAll('.basket__item-delete')
				.forEach((button) =>
					button.addEventListener('click', (event) =>
						this.handleRemoveClick(event)
					)
				);

			content.querySelector(
				'.basket__price'
			)!.textContent = `${this.calculateTotalPrice()} синапсов`;
			content
				.querySelector('.basket__button')
				?.addEventListener('click', () => this.handleCheckoutClick());
		}

		const modalContent = this.modal.querySelector(
			'.modal__content'
		) as HTMLElement;
		modalContent.innerHTML = '';
		modalContent.appendChild(content);
	}

	private handleRemoveClick(event: Event): void {
		const target = event.target as HTMLElement;
		const productId = target.dataset.id;
		if (productId) {
			this.cartService.removeFromCart(productId);
			this.render(); 
		}
	}

	private handleCheckoutClick(): void {
		// Logic to proceed to checkout 'Оформить'
	}

	private calculateTotalPrice(): number {
		return this.cartService
			.getCartItems()
			.reduce((total, item) => total + item.price, 0);
	}
}

class PaymentMethodModal extends BaseModal {
	constructor() {
		super();
		this.setupModal();
		this.render();
		this.open();
	}

	private render(): void {
		const template = document.getElementById('order') as HTMLTemplateElement;
		const content = template.content.firstElementChild?.cloneNode(
			true
		) as HTMLElement;

		if (content) {
			content
				.querySelector('.order__buttons')!
				.addEventListener('click', () => this.handleNextClick());
		}

		const modalContent = this.modal.querySelector(
			'.modal__content'
		) as HTMLElement;
		modalContent.innerHTML = '';
		modalContent.appendChild(content);
	}

	private handleNextClick(): void {
		// Logic to proceed to ContactInfoModal modal after validate the input
	}
}

class ContactInfoModal extends BaseModal {
	constructor() {
		super();
		this.setupModal();
		this.render();
		this.open();
	}

	private render(): void {
		const template = document.getElementById('contacts') as HTMLTemplateElement;
		const content = template.content.firstElementChild?.cloneNode(
			true
		) as HTMLElement;

		const modalContent = this.modal.querySelector(
			'.modal__content'
		) as HTMLElement;
		modalContent.innerHTML = '';
		modalContent.appendChild(content);
	}

	private handlePayClick(): void {
		// Logic to handle payment after validate the inputs
	}
}

class SuccessModal extends BaseModal {
	constructor(private amount: number) {
		super();
		this.setupModal();
		this.render();
		this.open();
	}

	private render(): void {
		const template = document.getElementById('success') as HTMLTemplateElement;
		const content = template.content.firstElementChild?.cloneNode(
			true
		) as HTMLElement;

		if (content) {
			content.querySelector(
				'.order-success__description'
			)!.textContent = `Списано ${this.amount} синапсов`;
			content
				.querySelector('.order-success__close')
				?.addEventListener('click', () => this.handleShopMoreClick());
		}

		const modalContent = this.modal.querySelector(
			'.modal__content'
		) as HTMLElement;
		modalContent.innerHTML = '';
		modalContent.appendChild(content);
	}

	private handleShopMoreClick(): void {
		this.close();
		// Logic to go back to shopping
	}
}
