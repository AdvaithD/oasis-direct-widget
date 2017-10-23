import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TradeFinalizer from "../components/TradeFinalizer";
import selectors from '../store/selectors/system'
const propTypes = PropTypes && {
  actions: PropTypes.object.isRequired
};

export class TradeFinalizerWrapper extends PureComponent {
  render() {
    const { transactionsList, data } = this.props;
    return (
      <TradeFinalizer transactionsList={transactionsList} data={data}/>
    );
  }
}

export function mapStateToProps(state) {
  return {
    data: selectors.tradeFinalizerData(state),
    transactionsList: selectors.transactionsList(state).toJS()
  };
}
export function mapDispatchToProps(dispatch) {
  const actions = {};
  return { actions: bindActionCreators(actions, dispatch) };
}

TradeFinalizerWrapper.propTypes = propTypes;
TradeFinalizerWrapper.displayName = 'TradeFinalizer';
export default connect(mapStateToProps, mapDispatchToProps)(TradeFinalizerWrapper);
