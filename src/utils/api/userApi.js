import API from './apiClient';
import { cleanObj, convertObjToQuery } from '../functions';

const userApi = {
  login: (data) => API.post('/user/login', data),
  loginWithFirebase: (data) => API.post('/user/login-with-firebase', data),
  logout: () => API.get('user/logout'),
  signup: (data) => API.post('/user/signup', cleanObj(data)),
  getUserById: (id) => API.get(`/user/${id}`),
  getUsers: (query) => {
    const url = '/user/all';
    return API.get(url + convertObjToQuery(cleanObj(query)));
  },
  updateUserInfo: (id, data) => API.put(`/user/${id}`, cleanObj(data)),
  resetPassword: (id, data) => API.post(`/user/${id}/reset-password`, cleanObj(data)),
  enableUser: (id) => API.post(`/user/${id}/enable`),
  disableUser: (id) => API.post(`/user/${id}/disable`)
};

export default userApi;
