import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TokenPicker from '../components/TokenPicker';
import selectors from '../store/selectors/system';
import actionHandler from '../store/reducers/system';


const propTypes = PropTypes && {
};

export class TokenPickerWrapper extends PureComponent {
  render() {
    const {
      isTokenPickerOpen,
      actions,
      tokens,
      selectedToken,
      disabledTokens,
      activeTokenControlName
    } = this.props;
    return (
        isTokenPickerOpen ? (
            <TokenPicker
                disabledTokens={disabledTokens}
                activeTokenControlName={activeTokenControlName}
                tokens={tokens}
                selectedToken={selectedToken}
                onTokenSelected={actions.TokenSelected}
                onToggleOpen={actions.ToggleOpen}
            />
        ): null
    );
  }
}

export function mapStateToProps(state) {
  return {
    tokens: selectors.items(state),
    activeTokenControlName: selectors.activeTokenControlName(state),
    isTokenPickerOpen: selectors.isOpen(state),
    selectedToken: selectors.selectedToken(state),
    disabledTokens: selectors.activeControlDisabledTokens(state)
  };
}
export function mapDispatchToProps(dispatch) {
  const actions = {
      ...actionHandler.actions,
      TokenSelected: actionHandler.actions.TokenSelected
  };
  return { actions: bindActionCreators(actions, dispatch) };
}

TokenPickerWrapper.propTypes = propTypes;
TokenPickerWrapper.displayName = 'TokenPickerContainer';
export default connect(mapStateToProps, mapDispatchToProps)(TokenPickerWrapper);
