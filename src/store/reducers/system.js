import { createAction, handleActions } from 'redux-actions';
import Immutable from 'immutable';

const START_TRANSACTION = 'SYSTEM/START_TRANSACTION';

const StartTransaction = createAction(
    START_TRANSACTION, (state) => undefined
)

const actions = {
  StartTransaction
};

const reducer = handleActions({
  [StartTransaction]: (state) => state.set('step', 2)
}, Immutable.fromJS(
  {
    step: 1,
    type: 'basic',
  }
));

export default {
  actions,
  reducer
};




