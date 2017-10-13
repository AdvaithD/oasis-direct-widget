import {
  combineReducers,
} from 'redux-immutable';

import system from './system';

export default combineReducers({
  'system':        system.reducer,
})