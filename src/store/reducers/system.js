import { createAction, handleActions } from 'redux-actions';
import Immutable from 'immutable';
import BigNumber from 'bignumber.js';
import {
  addressToBytes32, fromWeiToDecimal, loadObject, methodSig,
  toBytes32,
} from '../../helpers';
import web3 from '../../web3';

import promisify from '../../utils/promisify';
import {fulfilled} from '../../utils/store';

const settings = require('../../settings');
const dsproxy = require('../../abi/dsproxy');

/**
 *
 *  _________________ACTIONS___________________
 *
 */

const START_TRANSACTION = 'SYSTEM/START_TRANSACTION';

const StartTransaction = createAction(
    START_TRANSACTION, (state) => undefined
)

/**
 * Token picker actions
 */


const TOGGLE_OPEN = 'TOKEN_PICKER/TOGGLE_OPEN';
const SET_TOKEN_CONTROL_NAME = 'TOKEN_PICKER/SET_TOKEN_CONTROL_NAME';
const RESET_TOKEN_CONTROL_NAME = 'TOKEN_PICKER/RESET_TOKEN_CONTROL_NAME';

/**
 * Toggle picker open / closed.
 */
const ToggleOpen = createAction(
    TOGGLE_OPEN,
    (payload) => payload
)

/**
 * Sets name of token control we pick token type for
 */
const SetTokenControlName = createAction(
    SET_TOKEN_CONTROL_NAME,
    (v) => v
);


const ResetTokenControlName = createAction(
    RESET_TOKEN_CONTROL_NAME,
    () => null
);

/**
 * Tokens actions
 */


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
        actions.FetchBuyTransactionData(
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
        actions.FetchSellTransactionData(
            buyToken,
            receiveToken,
            value,
            appState.network.network,
            appState.system.proxy
        )
    )
  }
}

/**
 * Trade details actions
 */


const SET_TRANSACTION_FEE = 'TRADE_DETAILS/SET_TRANSACTION_FEE';
const SET_TOKEN_UNIT_SYMBOL = 'TRADE_DETAILS/SET_TOKEN_UNIT_SYMBOL';
const SET_TRANSACTION_MARKET = 'TRADE_DETAILS/SET_TRANSACTION_MARKET';

const SET_TOKEN_EXCHANGE_RATE = 'TRADE_DETAILS/SET_TOKEN_EXCHANGE_RATE';
const FETCH_BUY_TRANSACTION_DATA = 'TRADE_DETAILS/FETCH_BUY_TRANSACTION_DATA';
const FETCH_SELL_TRANSACTION_DATA = 'TRADE_DETAILS/FETCH_SELL_TRANSACTION_DATA';


const SetTransactionFee = createAction(
    SET_TRANSACTION_FEE, (transactionFee) => (d) => transactionFee
);

const SetTokenPriceUnitSymbol = createAction(
    SET_TOKEN_UNIT_SYMBOL, (unitSymbol) => unitSymbol
);

const SetTransactionMarket = createAction(
    SET_TRANSACTION_MARKET, (transactionMarket) => transactionMarket
);


const FetchBuyTransactionData = createAction(
    FETCH_BUY_TRANSACTION_DATA, async (sellToken, receiveToken, amount, network, proxyAddress) =>
        new Promise((res,rej)=> {
          loadObject(dsproxy.abi, proxyAddress).execute['address,bytes'].call(
              settings.chain[network].proxyContracts.oasisSai,
              `${methodSig('sellAllAmountPayEth(address,address,address,uint256)')}
          ${addressToBytes32(settings.chain[network].otc, false)}
          ${addressToBytes32(settings.chain[network].tokens.weth, false)}
          ${addressToBytes32(settings.chain[network].tokens[receiveToken.toLowerCase()], false)}
          ${toBytes32(0, false)}`,
              { value: web3.toWei(amount) },
              (e, r) => {
                if (!e) { res(fromWeiToDecimal(r)); }
                rej(e);
              }
          );
        })
);


/**
 * Fetch exchange rate for sell transaction
 */
const FetchSellTransactionData = createAction(
    FETCH_SELL_TRANSACTION_DATA, async (network, proxyAddress, sellToken, receiveToken, amount) => {
      // sellToken is always weth for now (we are always selling native eth in this version)
      web3.eth.getBalance(web3.eth.coinbase, (e, balance) => {
        // TODO: The account should come from state.network.defaultAccount instead of using web3.eth.coinbase
        if (!e) {
          loadObject(dsproxy.abi, proxyAddress).execute.call(settings[network].proxyContracts.oasisSai,
              `${methodSig('buyAllAmountPayEth(address,address,address,uint256)')}
          ${addressToBytes32(settings[network].otc, false)}
          ${addressToBytes32(settings[network].tokens[receiveToken.toLowerCase()], false)}
          ${addressToBytes32(settings[network].tokens.weth, false)}
            ${toBytes32(balance.valueOf(), false)}`,
              { value: balance },
              (e, r) => {
                if (!e) {
                  console.log(r);
                }
              }
          );
        }
      });
    }
);

const SetTokenExchangeRate = createAction(
    SET_TOKEN_EXCHANGE_RATE,
    () => null
)


const actions = {

  /**
   * TokenPicker
   */
  ToggleOpen,
  SetTokenControlName,
  ResetTokenControlName,
  /**
   * System
   */
  StartTransaction,
  /**
   * Tokens
   */
  TokenSelected,
  BuyAmountChanged,
  DepositAmountChanged,
  /**
   * Trade details
   */
  SetTransactionFee,
  SetTokenPriceUnitSymbol,
  SetTransactionMarket,
  FetchBuyTransactionData,
  FetchSellTransactionData
};


/**
 *
 *  _________________HANDLERS___________________
 *
 */


const initialState = Immutable.fromJS(
    {
      /**
       * eth related data
       */
      eth: {
        system: null,
        network: null
      },
      /**
       * System
       */
      step: 1,
      type: 'basic',
      /**
       * TokenPicker
       */
      activeTokenControlName: null,
      isOpen: false,

      /**
       * Tokens
       */
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
      tokenPrice: null,
      tokenExchangeRate: null,
      transactionFee: null,
      tokenPriceUnitSymbol: 'ETH',
      market: 'Oasisdex'

    }
)


const reducer = handleActions({
  /**
   * System handlers
   */
  [StartTransaction]: (state) => state.set('step', 2),

  /**
   * Token picker handlers
   */
  [ToggleOpen]: (state, { payload }) =>
      state
      .update('isOpen', v => !v)
      .update('activeTokenControlName', () => payload)
  ,
  [SetTokenControlName]: (state, {payload}) =>
      state
      .update('activeTokenControlName', () => payload),
  [ResetTokenControlName]: (state) =>
      state
      .update('activeTokenControlName', () => null),

  /**
   * Tokens handlers
   */

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
  ,
  [BUY_AMOUNT_CHANGED]: (state, {payload: {value} }) =>
      state
      .updateIn(['buy','amount'], v => value)
  ,
  [actions.FetchSellTransactionData]: (state, {payload})=>
      state.updateIn(['buy','amount'], payload),
  [actions.FetchBuyTransactionData]: (state)=> (state),
  /**
   * Trade details handlers
   */

  [SetTransactionFee]: (state, {payload}) =>
      state
      .update(
          'transactionFee', v => payload
      ),
  [SetTokenPriceUnitSymbol]: (state, {payload}) =>
      state
      .update(
          'tokenPriceUnitSymbol', v => payload
      ),
  [SetTransactionMarket]: (state, {payload}) =>
      state
      .update('market', v => payload)
  ,
  [fulfilled(FetchBuyTransactionData)]: (state, {payload}) =>
      state
      .updateIn(['buy','amount'], () => payload)
      .update(['transactionFee',() => .111]) // TODO put real data
      .update('tokenExchangeRate', ()=> 1.11) // TODO put real data
  ,
  [fulfilled(FetchSellTransactionData)]: (state, {payload}) =>
      state
      .updateIn(['deposit','amount'], () => payload),
  [SetTokenExchangeRate]: (state) => state

}, initialState);

export default {
  actions,
  reducer
};




