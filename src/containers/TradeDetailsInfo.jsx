import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';
import selectors from './../store/selectors/system';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TradeDetailsInfoBox from '../components/TradeDetailsInfoBox';

const propTypes = PropTypes && {
  actions: PropTypes.object.isRequired
};

export class TradeDetailsInfoWrapper extends PureComponent {
  render() {
    const { transactionInfo } = this.props;
    return (
        (<TradeDetailsInfoBox transactionInfo={transactionInfo}/>)
    );
  }
}

export function mapStateToProps(state) {
  return {
    transactionInfo: selectors.transactionInfo(state)
  };
}
export function mapDispatchToProps(dispatch) {
  const actions = {};
  return { actions: bindActionCreators(actions, dispatch) };
}

TradeDetailsInfoWrapper.propTypes = propTypes;
TradeDetailsInfoWrapper.displayName = 'TradeDetailsInfoContainer';
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TradeDetailsInfoWrapper);
