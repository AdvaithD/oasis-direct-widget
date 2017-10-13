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

const buyTokenValue = createSelector(
    state,
    (s) => s.getIn(['buy', 'value'])
);

const buyTokenAmount = createSelector(
    state,
    (s) => s.getIn(['buy', 'amount'])
);

/**
 *
 * Trade details selectors
 *
 */


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


const canStartTransaction = createSelector(
    buyTokenAmount,
    depositTokenAmount,
    (bta, dta) => !!(dta && bta)
);

const isTokenPickerOpen = createSelector(
    state,
    s => s.get('isTokenPickerOpen')
);


export default {
  state,
  activeStep,

  isOpen,
  selectedToken,
  activeTokenControlName,

  items,
  depositTokenValue,
  buyTokenValue,
  depositTokenAmount,
  buyTokenAmount,
  activeControlDisabledTokens,

  transactionFee,
  tokenPrice,
  tokenPriceUnitSymbol,
  transactionInfo,
  market,

  canStartTransaction,
  isTokenPickerOpen
}