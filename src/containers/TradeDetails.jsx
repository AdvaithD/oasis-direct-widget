import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TradeDetails from "../components/TradeDetails";
import actionHandler from '../store/reducers/system';
import selectors from '../store/selectors/system';


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
    disabled: !selectors.canStartTransaction(state),
    depositTokenValue: selectors.depositTokenValue(state),
    buyTokenValue: selectors.buyTokenValue(state),
    depositTokenAmount: selectors.depositTokenAmount(state),
    buyTokenAmount: selectors.buyTokenAmount(state)
  };
}
export function mapDispatchToProps(dispatch) {
  const actions = {
    StartTransaction: actionHandler.actions.StartTransaction,
    BuyAmountChanged: actionHandler.actions.BuyAmountChanged,
    DepositAmountChanged: actionHandler.actions.DepositAmountChanged,
    ToggleTokenPicker: actionHandler.actions.ToggleOpen
  };
  return { actions: bindActionCreators(actions, dispatch) };
}

TradeDetailsWrapper.propTypes = propTypes;
TradeDetailsWrapper.displayName = 'TradeDetailsContainer';
export default connect(mapStateToProps, mapDispatchToProps)(TradeDetailsWrapper);
