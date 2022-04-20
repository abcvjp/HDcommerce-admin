import { cleanObj, convertObjToQuery } from '../functions';
import API from './apiClient';

const orderApi = {
  getOrders: (query) => {
    const url = '/order';
    return API.get(url + convertObjToQuery(cleanObj(query)));
  },
  getOrder: (id) => API.get(`/order/${id}`),
  deleteOrder: (id) => API.delete(`/order/${id}`),
  deleteOrders: (orderIds) => API.delete('/order/all', {
    data: { orderIds }
  }),
  createOrder: (data) => {
    const url = '/order';
    return API.post(url, cleanObj(data));
  },
  updateOrder: (id, data) => {
    const url = `/order/${id}`;
    return API.patch(url, cleanObj(data));
  },
  updateOrdersStatus: (data) => API.patch('/order', { orders: data }),
  searchOrders: (query) => {
    const url = '/search';
    return API.get(url + convertObjToQuery(cleanObj(query)));
  },
  confirmOrder: (id) => API.patch(`/order/${id}/confirm`),
  cancelOrder: (id) => API.patch(`/order/${id}/cancel`),
  completeOrder: (id) => API.patch(`/order/${id}/complete`)
};

export default orderApi;
