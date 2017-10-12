import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TradeDetails from "../components/TradeDetails";
import systemHandler from '../store/reducers/system';
import transactionsSelectors from '../store/selectors/transactions';
import tokenPickerHandler from '../store/reducers/tokenPicker';
import tokensHandler from '../store/reducers/tokens';
import tradeDetailsHandler from '../store/reducers/tradeDetails';
import tokensSelectors from '../store/selectors/tokens';


const propTypes = PropTypes && {
  actions: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired
};


export class TradeDetailsWrapper extends PureComponent {
  render() {

    const {
      actions,
      disabled,
      depositTokenValue,
      buyTokenValue,
      depositTokenAmount,
      buyTokenAmount,
      appState
    } = this.props;

    return (
      <TradeDetails
        appState={appState}
        onBuyAmountChange={actions.BuyAmountChanged}
        onDepositAmountChange={actions.DepositAmountChanged}
        onStartTransaction={actions.StartTransaction}
        onToggleTokenPicker={actions.ToggleTokenPicker}
        depositTokenValue={depositTokenValue}
        buyTokenValue={buyTokenValue}
        disabled={disabled}
        depositTokenAmount={depositTokenAmount}
        buyTokenAmount={buyTokenAmount}
      />
    );
  }
}

export function mapStateToProps(state) {
  return {
    disabled: !transactionsSelectors.canStartTransaction(state),
    depositTokenValue: tokensSelectors.depositTokenValue(state),
    buyTokenValue: tokensSelectors.buyTokenValue(state),
    depositTokenAmount: tokensSelectors.depositTokenAmount(state),
    buyTokenAmount: tokensSelectors.buyTokenAmount(state)
  };
}
export function mapDispatchToProps(dispatch) {
  const actions = {
    StartTransaction: systemHandler.actions.StartTransaction,
    BuyAmountChanged: tokensHandler.actions.BuyAmountChanged,
    DepositAmountChanged: tokensHandler.actions.DepositAmountChanged,
    ToggleTokenPicker: tokenPickerHandler.actions.ToggleOpen
  };
  return { actions: bindActionCreators(actions, dispatch) };
}

TradeDetailsWrapper.propTypes = propTypes;
TradeDetailsWrapper.displayName = 'TradeDetailsContainer';
export default connect(mapStateToProps, mapDispatchToProps)(TradeDetailsWrapper);
