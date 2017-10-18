import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import App from '../components/App';
import handlers from './../store/reducers/system';

const propTypes = PropTypes && {
  actions: PropTypes.object.isRequired
};

export class AppWrapper extends PureComponent {
  render() {
    const { actions: {
      SyncSystemData,
      SyncNetworkData,
      InitNetwork,
    }
  } = this.props;
    return (
        <App
            onInitNetwork={InitNetwork}
            onSyncSystemData={SyncSystemData}
            onSyncNetworkData={SyncNetworkData}
        />
    );
  }
}

export function mapStateToProps() {
  return {};
}
export function mapDispatchToProps(dispatch) {
  const {
    SyncSystemData,
    SyncNetworkData,
    InitNetwork,
  } = handlers.actions;

  const actions = {
    SyncSystemData,
    SyncNetworkData,
    InitNetwork,
  };
  return { actions: bindActionCreators(actions, dispatch) };
}

AppWrapper.propTypes = propTypes;
AppWrapper.displayName = 'AppContainer';
export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper);
