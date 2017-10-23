import { createAction, handleActions } from 'redux-actions';
import Immutable from 'immutable';
import {
  addressToBytes32, loadObject, methodSig,
  toBytes32,
} from '../../helpers';
import web3 from '../../web3';

import {fulfilled, pending, rejected} from '../../utils/store';
import BigNumber from 'bignumber.js';
import promisify from '../../utils/promisify';
const settings =   require('../../settings');
const dsproxy =    require('../../abi/dsproxy');
const dstoken =    require('../../abi/dstoken');
const dsethtoken = require('../../abi/dsethtoken');


export const constants = Object.freeze({
  TRANSACTION_TYPE_BUY_ALL:  'TRANSACTION_TYPE_BUY_ALL',
  TRANSACTION_TYPE_SELL_ALL: 'TRANSACTION_TYPE_SELL_ALL'
});

/**
 *
 *  _________________ACTIONS___________________
 *
 */

/**
 * System actions
 */

const SET_USER_ACCOUNT_PROXY_CONTRACT_ADDRESS =
    'SYSTEM/SET_USER_ACCOUNT_PROXY_CONTRACT_ADDRESS';

const START_TRANSACTION = 'SYSTEM/START_TRANSACTION';
const INIT_NETWORK = 'SYSTEM/INIT_NETWORK';

const SYNC_NETWORK_DATA = 'SYSTEM/SYNC_NETWORK_DATA';
const SYNC_SYSTEM_DATA =  'SYSTEM/SYNC_SYSTEM_DATA';
const SYNC_DEFAULT_ACCOUNT_ETHER_BALANCE =
    'SYSTEM/SYNC_DEFAULT_ACCOUNT_ETHER_BALANCE';


const GetUserAccountsProxyContractAddresses = () => async (dispatch, store) => {
  const setUpAddress = (contract) => {
    const addr = settings.chain[store.network.network][contract];
    this.setState((prevState, props) => {
      const returnObj = {};
      returnObj[contract] = { address: addr };
      return returnObj;
    });
  }

  const setUpToken = (token) => {
    const addrs = settings.chain[store.network.network];
    this.setState((prevState, props) => {
      const tokens = {...prevState.tokens};
      const tok = {...tokens[token]};
      tok.address = addrs[token];
      tokens[token] = tok;
      return { tokens };
    }, () => {
      window[`${token}Obj`] = this[`${token}Obj`] = loadObject(
          token === 'weth' ? dsethtoken.abi : dstoken.abi, store.system.tokens[token].address);
      this.getDataFromToken(token);
      this.setFilterToken(token);
    });
  };

  const getProxyAddress = async () =>
      new Promise((resolve, reject) => {
        const addrs = settings.chain[store.network.network];
        window.proxyFactoryObj.Created(
            {sender: store.network.defaultAccount},
            {fromBlock: addrs.fromBlock},
        ).get((e, r) => { if (!e) { resolve(r);} else { reject(e); } });
      });

  const dsproxyfactory = require('../../abi/dsproxyfactory');
  const addrs = settings.chain[store.network.network];
  window.proxyFactoryObj = loadObject(dsproxyfactory.abi, addrs.proxyFactory);

  const setUpPromises = [await getProxyAddress()];
  const r = await Promise.all(setUpPromises);
  if (r[0].length > 0) {
    const proxy = r[0][r[0].length - 1].args.proxy;
    // this.setState((prevState, props) => {
    //   const system = {...prevState.system};
    //   system.proxy = proxy;
    //   return { system };
    // });
    dispatch(SetUserAccountProxyContractAddress(proxy));
    window.proxyObj = this.proxyObj = loadObject(dsproxy.abi, proxy);
  } else {}
  setUpAddress('otc');
  setUpAddress('tub');
  setUpToken('weth');
  setUpToken('mkr');
  setUpToken('sai');
  // This is necessary to finish transactions that failed after signing
  // this.setPendingTxInterval();
};

const SetUserAccountProxyContractAddress = createAction(
    SET_USER_ACCOUNT_PROXY_CONTRACT_ADDRESS,
    async (proxyAddress) => proxyAddress
);

const StartTransaction = createAction(
    START_TRANSACTION, (data) => data
);


const InitNetwork = createAction(
    INIT_NETWORK, (data) => data
);

const SyncNetworkData = createAction(
    SYNC_NETWORK_DATA, (data) => data
);

const SyncSystemData = createAction(
    SYNC_SYSTEM_DATA, (data) => data
);

const SyncDefaultAccountEtherBalance = createAction(
    SYNC_DEFAULT_ACCOUNT_ETHER_BALANCE, (data) => data
);

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

const RESET_AMOUNT_INPUTS = 'TOKENS/RESET_AMOUNT_INPUTS';
const RESET_DEPOSIT_AMOUNT_INPUT = 'TOKENS/RESET_DEPOSIT_AMOUNT_INPUT';
const RESET_BUY_AMOUNT_INPUT = 'TOKENS/RESET_BUY_AMOUNT_INPUT';

const DEPOSIT_AMOUNT_CHANGED = 'TOKENS/DEPOSIT_AMOUNT_CHANGED';
const DEPOSIT_AMOUNT_OVER_THE_LIMIT = 'TOKENS/DEPOSIT_AMOUNT_OVER_THE_LIMIT';
const DEPOSIT_AMOUNT_UNDER_THE_LIMIT = 'TOKENS/DEPOSIT_AMOUNT_UNDER_THE_LIMIT';
const DEPOSIT_AMOUNT_RESET_ERRORS = 'TOKENS/DEPOSIT_AMOUNT_RESET_ERRORS';
const DEPOSIT_AMOUNT_SET_ENABLED = 'TOKENS/DEPOSIT_AMOUNT_SET_ENABLED';
const DEPOSIT_AMOUNT_SET_DISABLED = 'TOKENS/DEPOSIT_AMOUNT_SET_DISABLED';

const BUY_AMOUNT_CHANGED = 'TOKENS/BUY_AMOUNT_CHANGED';
const BUY_AMOUNT_OVER_THE_LIMIT = 'TOKENS/BUY_AMOUNT_OVER_THE_LIMIT';
const BUY_AMOUNT_UNDER_THE_LIMIT = 'TOKENS/BUY_AMOUNT_UNDER_THE_LIMIT';
const BUY_AMOUNT_RESET_ERRORS = 'TOKENS/BUY_AMOUNT_RESET_ERRORS';
const BUY_AMOUNT_SET_ENABLED = 'TOKENS/BUY_AMOUNT_SET_ENABLED';
const BUY_AMOUNT_SET_DISABLED = 'TOKENS/BUY_AMOUNT_SET_DISABLED';

const TokenSelected = createAction(
  TOKEN_SELECTED,
  (v) => v,
);

function ChangeSelectedToken(token) {
  return (dispatch) => {
    dispatch(TokenSelected(token));
    dispatch(ResetAmountInputs());
    dispatch(ResetInfoBox());
  };
}

function DepositAmountChanged(
    sellToken,
    receiveToken,
    value,
    appState,
    hasErrors
) {

  return async (dispatch) => {
    // console.log({value});
    if(!isNaN(parseFloat(value)) && Number(value) >= 0) {
      const bnValue = new BigNumber(value);
      dispatch({
        type: DEPOSIT_AMOUNT_CHANGED,
        payload: { value }
      });

      if(bnValue.toNumber() > 0) {
        // TODO rely on actual events for this account address
        let accountBalance = await promisify(web3.eth.getBalance)(
            appState.network.defaultAccount
        );
        if(web3.fromWei(accountBalance, 'ether').sub(bnValue) < 0) {
          dispatch(DepositAmountOverTheLimit(bnValue.toNumber()));
        } else {

          if(hasErrors) { dispatch(DepositAmountResetErrors()); }
          dispatch(ResetInfoBox());
          dispatch(
              FetchBuyTransactionData(
                  sellToken,
                  receiveToken,
                  value,
                  appState.network.network,
                  appState.system.proxy
              )
          );
          const gasPrice = await promisify(web3.eth.getGasPrice).call();
          dispatch(SetTransactionGasPrice(gasPrice.valueOf()));
          dispatch(
              FetchBuyTransactionGasCost(
                  sellToken,
                  receiveToken,
                  value,
                  appState.network.network,
                  appState.system.proxy
              )
          );
          dispatch(SetTransactionType(constants.TRANSACTION_TYPE_SELL_ALL))
        }

      } else {
        dispatch(ResetInfoBox());
        dispatch(ResetBuyAmountInput());

      }
    }
  }
}


function BuyAmountChanged(buyToken, receiveToken, value, appState, hasErrors) {
  return async (dispatch) => {
    if(!isNaN(parseFloat(value)) && Number(value) >= 0) {
      const bnValue = new BigNumber(value);
      dispatch({
        type: BUY_AMOUNT_CHANGED,
        payload: { value: bnValue }
      });

      if(bnValue.toNumber() > 0) {

        // TODO rely on actual events for this account address
          if(hasErrors) { dispatch(BuyAmountResetErrors()); }
          dispatch(ResetInfoBox());
          dispatch(
              FetchSellTransactionData(
                  buyToken,
                  receiveToken,
                  value,
                  appState.network.network,
                  appState.system.proxy
              )
          );
          dispatch(SetTransactionType(constants.TRANSACTION_TYPE_BUY_ALL))

      } else {
        dispatch(ResetInfoBox());
        dispatch(ResetDepositAmountInput());
      }
    }
  }
}

const ResetAmountInputs = createAction(
    RESET_AMOUNT_INPUTS,
    () => null
);


const ResetBuyAmountInput = createAction(
    RESET_BUY_AMOUNT_INPUT,
    () => null
);

const ResetDepositAmountInput = createAction(
    RESET_DEPOSIT_AMOUNT_INPUT,
    () => null
);

const  DepositAmountOverTheLimit = createAction(
    DEPOSIT_AMOUNT_OVER_THE_LIMIT,
    (value, limit) => ({value, limit})
);

const  DepositAmountUnderTheLimit = createAction(
    DEPOSIT_AMOUNT_UNDER_THE_LIMIT,
    (value, limit) => ({value, limit})
);

const  DepositAmountResetErrors = createAction(
    DEPOSIT_AMOUNT_RESET_ERRORS,
    (resetOverTheLimit=true) =>
        ({overTheLimit: !resetOverTheLimit, underTheLimit: false})
);

const  DepositAmountSetDisabled = createAction(
    DEPOSIT_AMOUNT_SET_DISABLED,
    () => null
);

const  DepositAmountSetEnabled = createAction(
    DEPOSIT_AMOUNT_SET_ENABLED,
    () => null
);

const  BuyAmountOverTheLimit = createAction(
   BUY_AMOUNT_OVER_THE_LIMIT,
    (value, limit) => ({value, limit})
);


const BuyAmountUnderTheLimit = createAction(
    BUY_AMOUNT_UNDER_THE_LIMIT,
    (value, limit) => ({value, limit})
);

const  BuyAmountResetErrors = createAction(
    BUY_AMOUNT_RESET_ERRORS,
    (resetOverTheLimit=true) =>
        ({overTheLimit: resetOverTheLimit, underTheLimit: false})
);

const  BuyAmountSetDisabled = createAction(
    BUY_AMOUNT_SET_DISABLED,
    () => null
);

const  BuyAmountSetEnabled = createAction(
    BUY_AMOUNT_SET_ENABLED,
    () => null
);

/**
 * Trade details actions
 */

const SET_TRANSACTION_TYPE = 'TRADE_DETAILS/SET_TRANSACTION_TYPE';
const RESET_TRANSACTION_TYPE = 'TRADE_DETAILS/RESET_TRANSACTION_TYPE';

const SET_TRANSACTION_GAS_COST =  'TOKEN/SET_TRANSACTION_GAS_COST';

const SET_TRANSACTION_FEE = 'TRADE_DETAILS/SET_TRANSACTION_FEE';
const SET_TOKEN_UNIT_SYMBOL = 'TRADE_DETAILS/SET_TOKEN_UNIT_SYMBOL';
const SET_TRANSACTION_MARKET = 'TRADE_DETAILS/SET_TRANSACTION_MARKET';

const SET_TOKEN_EXCHANGE_RATE = 'TRADE_DETAILS/SET_TOKEN_EXCHANGE_RATE';
const FETCH_BUY_TRANSACTION_DATA = 'TRADE_DETAILS/FETCH_BUY_TRANSACTION_DATA';
const FETCH_BUY_TRANSACTION_GAS_COST = 'TRADE_DETAILS/FETCH_BUY_TRANSACTION_GAS_COST';
const FETCH_SELL_TRANSACTION_DATA = 'TRADE_DETAILS/FETCH_SELL_TRANSACTION_DATA';

const RESET_INFO_BOX = 'TRADE_DETAILS/RESET_INFO_BOX';


const ResetInfoBox = createAction(
    RESET_INFO_BOX, () => null
);

const SetTransactionType = createAction(
    SET_TRANSACTION_TYPE, (transactionType) => transactionType
);

const ResetTransactionType = createAction(
    RESET_TRANSACTION_TYPE, (transactionType) => transactionType
);

const SetTransactionFee = createAction(
    SET_TRANSACTION_FEE, (transactionFee) => (d) => transactionFee
);

const SetTokenPriceUnitSymbol = createAction(
    SET_TOKEN_UNIT_SYMBOL, (unitSymbol) => unitSymbol
);

const SetTransactionMarket = createAction(
    SET_TRANSACTION_MARKET, (transactionMarket) => transactionMarket
);

const SetTransactionGasPrice = createAction(
    SET_TRANSACTION_GAS_COST, (data) => data
);

const FetchBuyTransactionData = createAction(
  FETCH_BUY_TRANSACTION_DATA, async (sellToken, receiveToken, amount, network, proxyAddress) =>
    new Promise((resolve, reject)=> {
        loadObject(dsproxy.abi, proxyAddress).execute['address,bytes'].call(
            settings.chain[network].proxyContracts.oasisSai,
            `${methodSig('sellAllAmountPayEth(address,address,address,uint256)')}
        ${addressToBytes32(settings.chain[network].otc, false)}
        ${addressToBytes32(settings.chain[network].tokens['WETH'], false)}
        ${addressToBytes32(settings.chain[network].tokens[receiveToken], false)}
        ${toBytes32(0, false)}`,
            { value: web3.toWei(amount) },
            (e, r) => {
              if (!e) {
                if(r === '0x') {
                  reject({error: 'FETCH_BUY_TRANSACTION_DATA:REJECTED' });
                } else {
                //   console.log('FetchBuyTransactionData resolved value', r);
                  resolve(web3.fromWei(web3.toBigNumber(r), 'ether'));
                }
              } else {
                reject({error: e});
              }
            }
        );
      }
    ),
    () => ({ debounce: { time: 300, key: 'FetchBuyTransactionData' } })
);

const FetchBuyTransactionGasCost = createAction(
  FETCH_BUY_TRANSACTION_GAS_COST, async (sellToken, receiveToken, amount, network, proxyAddress) =>
    new Promise((resolve,reject)=> {
      const data = loadObject(dsproxy.abi, proxyAddress).execute['address,bytes'].getData(
        settings.chain[network].proxyContracts.oasisSai,
        `${methodSig('sellAllAmountPayEth(address,address,address,uint256)')}
        ${addressToBytes32(settings.chain[network].otc, false)}
        ${addressToBytes32(settings.chain[network].tokens['WETH'], false)}
        ${addressToBytes32(settings.chain[network].tokens[receiveToken], false)}
        ${toBytes32(0, false)}`
      );
      web3.eth.estimateGas(
          { to: proxyAddress, data, value: web3.toWei(amount) },
          (e, r) => {
            if (!e) { resolve(r); } else { reject(e); }
          }
      );
    }
  ),
  ({ debounce: { time: 300, key: 'FetchBuyTransactionGasCost' } })
);


/**
 * Fetch exchange rate for sell transaction
 */
const FetchSellTransactionData = createAction(
  FETCH_SELL_TRANSACTION_DATA, async (sellToken, receiveToken, amount, network, proxyAddress) =>
    // sellToken is always weth for now (we are always selling native eth in this version)
    new Promise((resolve, reject) => {
    console.log(
        {receiveToken }
    );
      web3.eth.getBalance(web3.eth.coinbase, (e, balance) => {
        // TODO: The account should come from state.network.defaultAccount instead of using web3.eth.coinbase
        if (!e) {
          loadObject(dsproxy.abi, proxyAddress).execute.call(settings.chain[network].proxyContracts.oasisSai,
              `${methodSig('buyAllAmountPayEth(address,address,address,uint256)')}
        ${addressToBytes32(settings.chain[network].otc, false)}
        ${addressToBytes32(settings.chain[network].tokens[receiveToken], false)}
        ${addressToBytes32(settings.chain[network].tokens['WETH'], false)}
        ${toBytes32(balance.valueOf(), false)}`,
              { value: balance },
              (e, r) => {
                if (!e) {
                  if(r === '0x') {
                    reject({error: 'FETCH_BUY_TRANSACTION_DATA:REJECTED' });
                  } else {
                    resolve(web3.fromWei(web3.toBigNumber(r), 'ether'));
                  }
                } else {
                  reject({error: e});
                }
              }
          );
        }
      });
    }),
    ({ debounce: { time: 300, key: 'FetchSellTransactionData' } })
);

const SetTokenExchangeRate = createAction(
  SET_TOKEN_EXCHANGE_RATE,
  () => null
);

/**
 * Sell / Buy transactions actions
 *
 */

const SELL_ALL_AMOUNT_PAY_ETH = 'SELL_BUY/SELL_ALL_AMOUNT_PAY_ETH';
const BUY_ALL_AMOUNT_PAY_ETH  = 'SELL_BUY/BUY_ALL_AMOUNT_PAY_ETH';
const SELL_ALL_AMOUNT = 'SELL_BUY/SELL_ALL_AMOUNT';
const BUY_ALL_AMOUNT = 'SELL_BUY/BUY_ALL_AMOUNT';
const SELL_ALL_AMOUNT_BUY_ETH = 'SELL_BUY/SELL_ALL_AMOUNT_BUY_ETH';
const BUY_ALL_AMOUNT_BUY_ETH  = 'SELL_BUY/BUY_ALL_AMOUNT_BUY_ETH';

const SellAllAmountPayEth = createAction(
    SELL_ALL_AMOUNT_PAY_ETH,
    () => {
      const
          otcBytes32 = null,
          fromAddrBytes32 = null,
          toAddrBytes32 = null,
          limit = null,
          amount = null;

      const callData =
          `${methodSig('sellAllAmountPayEth(address,address,address,uint256)')}
          ${otcBytes32}${fromAddrBytes32}${toAddrBytes32}${toBytes32(limit, false)}`;
    }
);

const BuyAllAmountPayEth = createAction(
    BUY_ALL_AMOUNT_PAY_ETH,
    () => {
      const
          otcBytes32 = null,
          fromAddrBytes32 = null,
          toAddrBytes32 = null,
          limit = null,
          amount = null;

      const callData =
          `${methodSig('buyAllAmountPayEth(address,address,uint256,address,uint256)')}
          ${otcBytes32}${toAddrBytes32}${toBytes32(web3.toWei(amount), false)}
          ${fromAddrBytes32}${toBytes32(limit, false)}`;
    }
);

const SellAllAmount = createAction(
    SELL_ALL_AMOUNT,
    () => {
      const
          otcBytes32 = null,
          fromAddrBytes32 = null,
          toAddrBytes32 = null,
          limit= null,
          amount = null;

      const callData =
          `${methodSig('sellAllAmount(address,address,uint256,address,uint256)')}
          ${otcBytes32}${fromAddrBytes32}${toBytes32(web3.toWei(amount), false)}
          ${toAddrBytes32}${toBytes32(limit, false)}`;
    }
);

const BuyAllAmount = createAction(
    BUY_ALL_AMOUNT,
    () => {
      const
          otcBytes32 = null,
          fromAddrBytes32 = null,
          toAddrBytes32 = null,
          limit = null,
          amount = null;

      const callData =
          `${methodSig('buyAllAmount(address,address,uint256,address,uint256)')}
          ${otcBytes32}${toAddrBytes32}${toBytes32(web3.toWei(amount), false)}
          ${fromAddrBytes32}${toBytes32(limit, false)}`;
    }
);

const SellAllAmountBuyEth = createAction(
    SELL_ALL_AMOUNT_BUY_ETH,
    () => {
      const
          otcBytes32 = null,
          fromAddrBytes32 = null,
          toAddrBytes32 = null,
          limit = null,
          amount = null;

      const callData =
          `${methodSig('sellAllAmountBuyEth(address,address,uint256,address,uint256)')}
          ${otcBytes32}${fromAddrBytes32}${toBytes32(web3.toWei(amount), false)}
          ${toAddrBytes32}${toBytes32(limit, false)}`;
    }
);

const BuyAllAmountBuyEth = createAction(
    BUY_ALL_AMOUNT_BUY_ETH,
    () => {
      const
          otcBytes32 = null,
          fromAddrBytes32 = null,
          toAddrBytes32 = null,
          limit = null,
          amount = null;

      const callData =
          `${methodSig('buyAllAmountBuyEth(address,address,uint256,address,uint256)')}
          ${otcBytes32}${toAddrBytes32}${toBytes32(web3.toWei(amount), false)}
          ${fromAddrBytes32}${toBytes32(limit, false)}`;
    }
);


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
  InitNetwork,
  StartTransaction,
  SyncNetworkData,
  SyncSystemData,
  SyncDefaultAccountEtherBalance,

  /**
   * Tokens
   */
  ChangeSelectedToken,
  BuyAmountChanged,
  DepositAmountChanged,
  /**
   * Trade details
   */
  SetTransactionType,
  ResetAmountInputs,
  SetTransactionFee,
  SetTokenPriceUnitSymbol,
  SetTransactionMarket,
  FetchBuyTransactionData,
  FetchBuyTransactionGasCost,
  FetchSellTransactionData,
};


/**
 *  _________________HANDLERS___________________
 *
 */

export const TRANSACTION_TYPE_CREATE_PROXY_ACC = 'TRANSACTIONS/TRANSACTION_TYPE_CREATE_PROXY_ACC';
export const TRANSACTION_TYPE_DEPOSIT = 'TRANSACTIONS/TRANSACTION_TYPE_APPROVING';
export const TRANSACTION_TYPE_BUY = 'TRANSACTIONS/TRANSACTION_TYPE_BUY';

export const TRANSACTION_STATUS_SIGNED = 'TRANSACTIONS/TRANSACTION_STATUS_SIGNED';
export const TRANSACTION_STATUS_WAITING = 'TRANSACTIONS/TRANSACTION_STATUS_WAITING';
export const TRANSACTION_STATUS_PENDING = 'TRANSACTIONS/TRANSACTION_STATUS_PENDING';
export const TRANSACTION_STATUS_CONFIRMED = 'TRANSACTIONS/TRANSACTION_STATUS_CONFIRMED';


const initialState = Immutable.fromJS(
    {

      /**
       * eth related data
       */
      eth: {
        system: null,
        network: null,
        defaultAccountBalance: null
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
        { symbol: 'WETH', name: 'Ether' },
        { symbol: 'MKR', name: 'Maker' },
        { symbol: 'REP', name: 'Augur' },
        { symbol: 'GNT', name: 'Golem' },
        { symbol: 'DGX', name: 'Digix' },
        { symbol: 'SAI', name: 'SAI' },
      ],

      deposit: {
        amount: null,
        disableControl: false,
        disabled: [
          'MKR', 'REP', 'GNT', 'DGX','SAI'
        ],
        errors: {
          overTheLimit: false,
          valueToSmall: false
        },
        value: 'WETH',
      },

      buy: {
        amount: null,
        disableControl: false,
        disabled: ['WETH'],
        errors: {
          overTheLimit: false,
          valueTooSmall: false
        },
        value: 'SAI',
      },

      tokenPrice: null,
      tokenExchangeRate: null,
      transactionFee: null,
      tokenPriceUnitSymbol: 'ETH',
      market: 'Oasisdex',

      transactions: {
        list: [
          {
            type: TRANSACTION_TYPE_CREATE_PROXY_ACC,
            status: TRANSACTION_STATUS_SIGNED,
            amount: 1.12345,
          },
          {
            type: TRANSACTION_TYPE_DEPOSIT,
            status: TRANSACTION_STATUS_SIGNED,
            amount: 1.12345,
            token: 'WETH'

          },
          {
            type: TRANSACTION_TYPE_BUY,
            status: TRANSACTION_STATUS_WAITING,
            amount: 22.12345,
            token: 'SAI'

          },

        ],
        gasPrice: {
          last_updated: null,
          value: null
        },
        type: null,
        status: null
      }
    }
);


const reducer = handleActions({
  [SellAllAmountPayEth]: (state) =>
      state
      .setIn(['transactions', 'type'], constants.TRANSACTION_TYPE_SELL_ALL),
  [BuyAllAmountPayEth]: (state) =>
      state
      .setIn(['transactions', 'type'], constants.TRANSACTION_TYPE_BUY_ALL),
  [SellAllAmount]:(state) =>
      state
      .setIn(['transactions', 'type'], constants.TRANSACTION_TYPE_SELL_ALL),
  [BuyAllAmount]: (state) =>
      state
      .setIn(['transactions', 'type'], constants.TRANSACTION_TYPE_BUY_ALL),
  [SellAllAmountBuyEth]: (state) =>
      state
      .setIn(['transactions', 'type'], constants.TRANSACTION_TYPE_SELL_ALL),
  [BuyAllAmountBuyEth]: (state) =>
      state
      .setIn(['transactions', 'type'], constants.TRANSACTION_TYPE_BUY_ALL),
  [SetUserAccountProxyContractAddress]: (state, {payload}) =>
      state.setIn(payload),
  /**
   * System handlers
   */

  [InitNetwork]: (state) => state,
  [StartTransaction]: (state) => state.set('step', 2),
  [SyncNetworkData]: (state, {payload}) =>
      state.updateIn(['eth', 'network'], () => payload),
  [SyncSystemData]: (state, {payload}) =>
      state.updateIn(['eth', 'system'], () => payload),
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

  [ResetAmountInputs]: (state) =>
      state
      .setIn(['buy','amount'], null)
      .setIn(['deposit','amount'], null)
  ,
  [ResetDepositAmountInput]: (state) => state.setIn(['deposit', 'amount'], null),
  [ResetBuyAmountInput]: (state) => state.setIn(['buy', 'amount'], null),
  [ResetInfoBox]: (state) =>
      state
      .set('tokenPrice', null)
      .set('transactionFee', null)
      .set('tokenExchangeRate', null)
      .set('transactionFee', null)
  ,
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
      .updateIn( ['deposit','amount'], v => web3.toBigNumber(value))
  ,
  [DepositAmountOverTheLimit]: (state, { payload: { value, limit } }) =>
      state.updateIn(
          ['deposit','errors'], (e) => ({...e, overTheLimit: true})
      ),
  [DepositAmountUnderTheLimit]: (state, { payload: { value, limit } }) =>
      state.updateIn(
          ['deposit','errors'], (e) => ({...e, underTheLimit: true})
      ),
  [DepositAmountResetErrors]: (state, { payload }) =>
      state.setIn(
          ['deposit','errors'], payload
      ),
  [DepositAmountSetEnabled]: (state, { payload }) =>
      state.setIn(
          ['deposit','disableControl'], false
      ),
  [DepositAmountSetDisabled]: (state) =>
      state.setIn(
          ['deposit','disableControl'], true
      ),

  [BuyAmountOverTheLimit]: (state, { payload: { value, limit } }) =>
      state.updateIn(
          ['buy','errors'], (e) => ({...e, overTheLimit: true})
      ),
  [BuyAmountUnderTheLimit]: (state, { payload: { value, limit } }) =>
      state.updateIn(
          ['deposit','errors'], (e) => ({...e, underTheLimit: true})
      ),
  [BuyAmountResetErrors]: (state, { payload }) =>
      state.setIn(
          ['buy','errors'], payload
      ),
  [BUY_AMOUNT_CHANGED]: (state, {payload: {value} }) =>
      state
      .updateIn(['buy','amount'], v => web3.toBigNumber(value))
  ,
  [BuyAmountSetEnabled]: (state, { payload }) =>
      state.setIn(
          ['buy','disableControl'], false
      ),
  [BuyAmountSetDisabled]: (state) =>
      state.setIn(
          ['buy','disableControl'], true
      ),
  /**
   * Trade details handlers
   */

  [SetTransactionGasPrice]: (state, {payload}) =>
      state
      .setIn(['transactions','gasPrice','value'], payload)
      .setIn(['transactions','gasPrice','last_updated'], Date.now())
  ,
  [SetTransactionType]: (state, {payload}) =>
      state.setIn(['transactions', 'type'], payload),
  [ResetTransactionType]: (state, {payload}) =>
      state.setIn(['transactions', 'type'], null),
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



  [pending(FetchBuyTransactionData)]: (state) => state,
  [fulfilled(FetchBuyTransactionData)]: (state, {payload}) =>
      state
      .updateIn(['buy','amount'], () => payload)
      .update(
          'tokenPrice',
          () => {
            const buyAmount = payload;
            const depositAmount = state.getIn(['deposit', 'amount']);
            return depositAmount.div(buyAmount).toFormat(5);
          }
      ),
  [rejected(FetchBuyTransactionData)]:(state) => state,



  [pending(FetchBuyTransactionGasCost)]:(state) => state,
  [fulfilled(FetchBuyTransactionGasCost)]: (state, {payload}) =>
    state
    .update('transactionFee',
        () => {
          const gasPrice = state.getIn(['transactions','gasPrice', 'value']);
          return web3
            .toBigNumber(web3
            .fromWei(payload, 'ether'))
            .times(gasPrice).toFormat(5)
        }
    ),
  [rejected(FetchBuyTransactionGasCost)]:(state) => state,


  [pending(FetchSellTransactionData)]:(state) => state,
  [fulfilled(FetchSellTransactionData)]: (state, {payload}) => {
    return state
      .setIn(['deposit','amount'], payload)
      .update(
        'tokenPrice', () => web3.toBigNumber(0x1).div(1).toFormat(5)
      )
  },
  [rejected(FetchSellTransactionData)]:(state) => state,


  [SetTokenExchangeRate]: (state) => state

}, initialState);

export default {
  actions,
  reducer
};
