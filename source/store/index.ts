import {combineReducers} from 'redux';
import userReducer from './user';
import usersReducers from './users';
import messageReducer from './message';

const AppReducer = combineReducers({
  userReducer,
  usersReducers,
  messageReducer,
});

export const store = {
  reducer: AppReducer,
};
