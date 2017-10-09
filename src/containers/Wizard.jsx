import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import systemSelectors from '../store/selectors/system'
import TradeDetailsWrapper from './TradeDetails';
import TradeFinalizerWrapper from "./TradeFinalizer";

const propTypes = PropTypes && {
  actions: PropTypes.object.isRequired
};

export class WizardWrapper extends PureComponent {


  render() {
    const { activeStep } = this.props;
    switch(activeStep) {

      case 1:
        return (<TradeDetailsWrapper/>);
      case 2:
        return (<TradeFinalizerWrapper></TradeFinalizerWrapper>)

      default: return null;
    }
  }
}

export function mapStateToProps(state) {
  return {
    activeStep: systemSelectors.activeStep(state)
  };
}
export function mapDispatchToProps(dispatch) {
  const actions = {};
  return { actions: bindActionCreators(actions, dispatch) };
}

WizardWrapper.propTypes = propTypes;
WizardWrapper.displayName = 'WizardWrapper';
export default connect(mapStateToProps, mapDispatchToProps)(WizardWrapper);
