import { combineReducers } from 'redux';
import alertMessageReducer from './alertMessageReducer';
import confirmDialogReducer from './confirmDialogReducer';
import fullscreenLoadingReducer from './fullscreenLoading';
import userReducer from './userReducer';

export default combineReducers({
  ui: combineReducers({
    alertMessage: alertMessageReducer,
    confirmDialog: confirmDialogReducer,
    fullscreenLoading: fullscreenLoadingReducer,
  }),
  user: userReducer
});
