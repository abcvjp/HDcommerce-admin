import { cleanObj, convertEmptyToNull, convertObjToQuery } from '../functions';
import API from './apiClient';

const productApi = {
  getAll: (query) => {
    const url = '/product';
    return API.get(url + convertObjToQuery(cleanObj(query)));
  },
  deleteProduct: (id) => API.delete(`/product/${id}`),
  deleteProducts: (productIds) => API.delete('/product', {
    data: { productIds }
  }),
  createProduct: (data) => {
    const url = '/product';
    return API.post(url, convertEmptyToNull(data));
  },
  editProduct: (id, data) => {
    const url = `/product/${id}`;
    return API.put(url, convertEmptyToNull(data));
  },
  searchProducts: (query) => {
    const url = '/search';
    return API.get(url + convertObjToQuery(cleanObj(query)));
  }
};

export default productApi;
