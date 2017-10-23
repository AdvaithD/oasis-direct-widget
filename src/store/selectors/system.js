import { createSelector } from 'reselect';

const state = s => s.get('system');
/**
 *
 *  System selectors
 *
 */
const activeStep = createSelector(state, s => s.get('step'));

/**
 *
 * Token picker selectors
 *
 */

const isOpen = createSelector(state, s => s.get('isOpen'));

const activeTokenControlName = createSelector(
    state,
    s => s.get('activeTokenControlName')
);

const selectedToken = createSelector(
    state,
    activeTokenControlName,
    (s, atcn) => s.getIn([ atcn, 'value'])
);

/**
 *
 * Tokens selectors
 *
 */

const activeControlDisabledTokens = createSelector(
    state,
    activeTokenControlName,
    (s, atcn) => s.getIn([ atcn, 'disabled'])
);
const items = createSelector(
    state,
    (s) => s.get('items')
);

const depositTokenValue = createSelector(
    state,
    (s) => s.getIn(['deposit', 'value'])
);

const depositTokenAmount = createSelector(
    state,
    (s) => s.getIn(['deposit', 'amount'])
);
const depositTokenAmountErrors = createSelector(
    state,
    (s) => s.getIn(['deposit', 'errors'])
);

const isDepositAmountControlDisabled = createSelector(
    state,
    (s) => s.getIn(['deposit', 'disableControl'])
);


const buyTokenValue = createSelector(
    state,
    (s) => s.getIn(['buy', 'value'])
);

const buyTokenAmount = createSelector(
    state,
    (s) => s.getIn(['buy', 'amount'])
);

const buyTokenAmountErrors = createSelector(
    state,
    (s) => s.getIn(['buy', 'errors'])
);

const isBuyAmountControlDisabled = createSelector(
    state,
    (s) => s.getIn(['buy', 'disableControl'])
);

const depositAmountControlState = createSelector(
  state,
  (s) => s.get('deposit'),
);

const buyAmountControlState = createSelector(
    state,
    (s) => s.get('buy')
);

/**
 *
 * Trade details selectors
 *
 */

const activeTransactionType =  createSelector(
    state,
    s => s.getIn(['transactions', 'type'])
);

const transactionFee = createSelector(
    state,
    s => s.get('transactionFee')
);

const tokenPrice = createSelector(
    state,
    s => s.get('tokenPrice')
);

const tokenPriceUnitSymbol = createSelector(
    state,
    s => s.get('tokenPriceUnitSymbol')
);

const market = createSelector(
    state,
    s => s.get('market')
);

const transactionInfo = createSelector(
    tokenPrice,
    tokenPriceUnitSymbol,
    transactionFee,
    market,
    (tokenPrice, tokenPriceUnitSymbol, transactionFee, market) => {
      const info = {
        tokenPrice,
        tokenPriceUnitSymbol,
        transactionFee,
        market
      };
      if(Object.values(info).every(v => !!v)) { return info; }
      else return {};
    }
);

/**
 *
 * Transactions selectors
 *
 */

const transactionsList = createSelector(
    state,
    (s) => s.getIn(['transactions', 'list'])
);

const tradeFinalizerData = createSelector(
    state,
    (s) => ({
      fromToken: s.getIn(['deposit','value']),
      toToken: s.getIn(['buy','value']),
      fromAmount: s.get(['deposit', 'amount']),
      toAmount: s.get(['buy', 'amount']),
      tokenPrice: s.get('tokenPrice')
    })
);


const canStartTransaction = createSelector(
    buyTokenAmount,
    depositTokenAmount,
    (bta, dta) => Number(dta) > 0 && Number(bta) > 0
);

const isTokenPickerOpen = createSelector(
    state,
    s => s.get('isTokenPickerOpen')
);


export default {
  state,
  activeStep,
  activeTransactionType,

  isOpen,
  selectedToken,
  activeTokenControlName,

  items,
  depositTokenValue,
  depositTokenAmountErrors,
  depositTokenAmount,
  depositAmountControlState,
  buyAmountControlState,
  isDepositAmountControlDisabled,
  buyTokenAmount,
  buyTokenValue,
  buyTokenAmountErrors,
  isBuyAmountControlDisabled,
  activeControlDisabledTokens,


  transactionFee,
  tokenPrice,
  tokenPriceUnitSymbol,
  transactionInfo,
  market,

  canStartTransaction,
  transactionsList,
  tradeFinalizerData,
  isTokenPickerOpen
}