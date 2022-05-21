import API from './apiClient';
import { cleanObj, convertObjToQuery } from '../functions';

const userApi = {
  login: (data) => API.post('/auth/login', data),
  loginWithFirebase: (data) => API.post('/user/login-with-firebase', data),
  logout: () => API.post('auth/logout'),
  signup: (data) => API.post('/user', cleanObj(data)),
  getUserById: (id) => API.get(`/user/${id}`),
  getUsers: (query) => {
    const url = '/user';
    return API.get(url + convertObjToQuery(cleanObj(query)));
  },
  updateUserInfo: (data) => API.put('/user/me', cleanObj(data)),
  updateUser: (id, data) => API.put(`/user/${id}`, cleanObj(data)),
  resetPassword: (data) => API.put('/user/me/password', cleanObj(data)),
  enableUser: (id) => API.patch(`/user/${id}/enable`),
  disableUser: (id) => API.patch(`/user/${id}/disable`)
};

export default userApi;
