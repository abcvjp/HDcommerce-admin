import { SET_USER } from 'src/constants/actionTypes';

export const setUser = (user) => ({
  type: SET_USER,
  payload: {
    user
  }
});

export const changeUser = (user) => ({
  type: SET_USER,
  payload: {
    user
  }
});
