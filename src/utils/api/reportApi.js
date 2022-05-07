import API from './apiClient';
import { cleanObj, convertObjToQuery } from '../functions';

const reportApi = {
  getOrderReport: (query) => {
    const url = '/report/sale';
    return API.get(url + convertObjToQuery(cleanObj(query)));
  }
};

export default reportApi;
