import { API_URL } from '../utils/constants';
import { ICard } from '../types';
import { Api, ApiListResponse } from './base/api';

export class LarekApi extends Api {
  constructor(baseUrl: string = API_URL, options: RequestInit = {}) {
    super(baseUrl, options);
  }

  // Метод для получения списка карточек
  getCards(): Promise<ApiListResponse<ICard>> {
    return this.get('/product/') as Promise<ApiListResponse<ICard>>;
  }

  // Метод для создания заказа
  createOrder(order: {payment: string, email: string, phone: string, address: string, total: number, items: string[]}): Promise<object> {
    return this.post('/order', order);
  }
};