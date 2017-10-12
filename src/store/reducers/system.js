import { createAction, handleActions } from 'redux-actions';
import Immutable from 'immutable';
import { methodSig, loadObject, toBytes32, addressToBytes32 } from '../../helpers';
import web3 from  '../../web3';
const settings = require('../../settings');
const dsproxy = require('../../abi/dsproxy');

const GET_BUY_AMOUNT = 'SYSTEM/GET_BUY_AMOUNT';
const GET_PAY_AMOUNT = 'SYSTEM/GET_BUY_AMOUNT';
const START_TRANSACTION = 'SYSTEM/START_TRANSACTION';

const GetBuyAmount = createAction(
  // network: should come from state.network.network
  // proxyAddress: should come from state.system.proxy
  // sellToken: should come from the tokenPicker from
  // receiveToken: should come from the tockenPicker to
  // amount: should come from deposit amount input value
  GET_BUY_AMOUNT, async (network, proxyAddress, sellToken, receiveToken, amount) => {
    // sellToken is always weth for now (we are always selling native eth in this version)
    loadObject(dsproxy.abi, proxyAddress).execute.call(settings[network].proxyContracts.oasisSai,
      `${methodSig('sellAllAmountPayEth(address,address,address,uint256)')}${addressToBytes32(settings[network].otc, false)}${addressToBytes32(settings[network].tokens.weth, false)}${addressToBytes32(settings[network].tokens[receiveToken], false)}${toBytes32(0, false)}`,
      { value: web3.toWei(amount) },
      (e, r) => {
        if (!e) {
          console.log(r);
        }
      });
  }
)

const GetPayAmount = createAction(
  GET_PAY_AMOUNT, async (network, proxyAddress, sellToken, receiveToken, amount) => {
    // sellToken is always weth for now (we are always selling native eth in this version)
    web3.eth.getBalance(web3.eth.coinbase, (e, balance) => {
      // TODO: The account should come from state.network.defaultAccount instead of using web3.eth.coinbase
      if (!e) {
        loadObject(dsproxy.abi, proxyAddress).execute.call(settings[network].proxyContracts.oasisSai,
          `${methodSig('buyAllAmountPayEth(address,address,address,uint256)')}${addressToBytes32(settings[network].otc, false)}${addressToBytes32(settings[network].tokens[receiveToken], false)}${addressToBytes32(settings[network].tokens.weth, false)}${toBytes32(balance.valueOf(), false)}`,
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
)

const StartTransaction = createAction(
    START_TRANSACTION, (state) => undefined
)

const actions = {
  GetBuyAmount,
  GetPayAmount,
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




