import { createStore } from 'redux';
import rootReducer from './reducers';

const initialState = {
  user: null,
  ui: {
    alertMessage: {
      isShown: false,
      type: '',
      content: ''
    },
    confirmDialog: {
      isOpen: false,
      message: '',
      onConfirm: () => {},
      onCancel: () => {}
    },
    fullscreenLoading: {
      isShown: false
    }
  }
};

const store = createStore(rootReducer, initialState);

export default store;
