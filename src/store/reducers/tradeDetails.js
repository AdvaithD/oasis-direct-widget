import {createAction, handleActions} from 'redux-actions';
import Immutable from 'immutable';
import {
  addressToBytes32, loadObject, methodSig,
  toBytes32,
} from '../../helpers';
import web3 from '../../web3';

const settings = require('../../settings');
const dsproxy = require('../../abi/dsproxy');


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
    FETCH_BUY_TRANSACTION_DATA, async (sellToken, receiveToken, amount, network, proxyAddress) => {
      console.log(sellToken, receiveToken, amount, network, proxyAddress);
      loadObject(dsproxy.abi, proxyAddress).execute.call(
          settings[network].proxyContracts.oasisSai,
          `${methodSig('sellAllAmountPayEth(address,address,address,uint256)')}${addressToBytes32(settings[network].otc, false)}${addressToBytes32(settings[network].tokens[receiveToken], false)}${addressToBytes32(settings[network].tokens[sellToken], false)}${toBytes32(0, false)}`,
          { value: web3.toWei(amount) },
          (e, r) => {
            if (!e) {
              console.log(r);
            }
          });
    }
);


/**
 * Fetch exchange rate for sell transaction
 */
const FetchSellTransactionData = createAction(
    FETCH_SELL_TRANSACTION_DATA, async (sellToken, receiveToken, amount) => (
        {sellToken, receiveToken, amount}
    )
);

const SetTokenExchangeRate = createAction(
    SET_TOKEN_EXCHANGE_RATE,
    () => null
)


const actions = {
  SetTransactionFee,
  SetTokenPriceUnitSymbol,
  SetTransactionMarket,
  FetchBuyTransactionData,
  FetchSellTransactionData
};



const reducer = handleActions({
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
      .update('market', v => payload),
  [FetchBuyTransactionData]: (state, {payload}) => state,
  [FetchSellTransactionData]: (state, {payload}) => state,
  [SetTokenExchangeRate]: (state) => state

}, Immutable.fromJS(
  {
    transactionFee: null,
    tokenPriceUnitSymbol: null,
    tokenExchangeRate: 1.2,
    market: null
  }
));

export default {
  actions,
  reducer
};




