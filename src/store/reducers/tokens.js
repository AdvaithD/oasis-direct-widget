import {createAction, handleActions} from 'redux-actions';
import Immutable from 'immutable';
import BigNumber from 'bignumber.js';
import tradeDetailsHandler from './tradeDetails';

const TOKEN_SELECTED = 'TOKENS/TOKEN_SELECTED';
const DEPOSIT_AMOUNT_CHANGED = 'TOKENS/DEPOSIT_AMOUNT_CHANGED';
const BUY_AMOUNT_CHANGED = 'TOKENS/BUY_AMOUNT_CHANGED';

const TokenSelected = createAction(
    TOKEN_SELECTED,
    (v) => v,
);

function DepositAmountChanged(sellToken, receiveToken, value, appState) {
  return (dispatch) => {
      dispatch({
        type: DEPOSIT_AMOUNT_CHANGED,
        payload: { value: parseFloat(value)}
      });
      dispatch(
          tradeDetailsHandler.actions.FetchBuyTransactionData(
              sellToken,
              receiveToken,
              value,
              appState.network.network,
              appState.system.proxy
          )
      )
  }
}

function BuyAmountChanged(buyToken, receiveToken, value, appState) {
  return (dispatch) => {
    dispatch({
      type: BUY_AMOUNT_CHANGED,
      payload: { value: parseFloat(value)}
    });
    dispatch(
        tradeDetailsHandler.actions.FetchSellTransactionData(
            buyToken,
            receiveToken,
            value,
            appState.network.network,
            appState.system.proxy
        )
    )
  }
}

const actions = {
  TokenSelected,
  BuyAmountChanged,
  DepositAmountChanged
};


const reducer = handleActions(
    {
      [TokenSelected]: (
          state,
          { payload: {tokenSymbol, activeTokenControlName} }
      ) =>
        state
          .updateIn(
              [activeTokenControlName, 'value'],
              () => tokenSymbol
          )
      ,
      [DEPOSIT_AMOUNT_CHANGED]: (state, {payload: {value} }) =>
          state
            .updateIn( ['deposit','amount'], v => value)
            .updateIn(['buy','amount'],
                () => {
                  const depositAmount = value;
                  const tokenExchangeRate = state.get('tokenExchangeRate');
                  if(depositAmount) {
                    return new BigNumber(depositAmount)
                    .div(tokenExchangeRate)
                    .toFormat(5);
                  }
                }
            )
      ,
      [BUY_AMOUNT_CHANGED]: (state, {payload: {value} }) =>
          state
          .updateIn(['buy','amount'], v => value)
          .updateIn(['deposit','amount'],
              () => {
                const buyAmount = value;
                const tokenExchangeRate = state.get('tokenExchangeRate');
                if(buyAmount) {
                  return new BigNumber(buyAmount)
                  .mul(tokenExchangeRate)
                  .toFormat(5);
                }
              }
          )
      ,
      [tradeDetailsHandler.actions.FetchSellTransactionData]: (state)=> ({}),
      [tradeDetailsHandler.actions.FetchBuyTransactionData]: (state)=> ({})

    },

    Immutable.fromJS(
        {
          items: [
            { symbol: 'ETH', name: 'Ether' },
            { symbol: 'MKR', name: 'Maker' },
            { symbol: 'REP', name: 'Augur' },
            { symbol: 'GNT', name: 'Golem' },
            { symbol: 'DGX', name: 'Digix' },
            { symbol: 'SAI', name: 'SAI' },
          ],
          deposit: {
            amount: 0,
            disabled: [
                'MKR', 'REP', 'GNT', 'DGX','SAI'
            ],
            value: 'ETH',
          },
          buy: {
            amount: 0,
            disabled: ['ETH'],
            value: 'SAI',
          },
          tokenExchangeRate:1.2,
          tokenExchangeFee: 22,
          tokenSymbol: 'ETH'
        },
    ));

export default {
  actions,
  reducer,
};




