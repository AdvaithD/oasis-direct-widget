import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
const actions = {};

const reducer = handleActions({}, Immutable.fromJS({}));

export default {
  actions,
  reducer
};
