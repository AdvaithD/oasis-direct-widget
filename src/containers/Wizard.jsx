import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import selectors from '../store/selectors/system'
import TradeDetailsWrapper from './TradeDetails';
import TradeFinalizerWrapper from "./TradeFinalizer";
import AccountLocked from '../components/AccountLocked';

import web3 from '../web3';

const propTypes = PropTypes && {
  actions: PropTypes.object.isRequired
};

export class WizardWrapper extends PureComponent {

  content() {
    const { eth: { defaultAccount } } = web3;
    if(defaultAccount) {
      const { activeStep, appState } = this.props;
      switch(activeStep) {
        case 1:
          return (<TradeDetailsWrapper appState={appState}/>);
        case 2:
          return (<TradeFinalizerWrapper appState={appState}/>);

        default: return null;
      }

    } else { return (<AccountLocked/>); }
  }

  render() {
    return (
        <div>
          {this.content()}
        </div>
    );
  }
}

export function mapStateToProps(state) {
  return {
    activeStep: selectors.activeStep(state)
  };
}
export function mapDispatchToProps(dispatch) {
  const actions = {};
  return { actions: bindActionCreators(actions, dispatch) };
}

WizardWrapper.propTypes = propTypes;
WizardWrapper.displayName = 'WizardWrapper';
export default connect(mapStateToProps, mapDispatchToProps)(WizardWrapper);
