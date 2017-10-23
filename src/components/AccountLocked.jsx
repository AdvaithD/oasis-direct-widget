import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';

import  './AccountLocked.scss';


const propTypes = PropTypes && {
};
const defaultProps = {};


class AccountLocked extends PureComponent {
  render() {
    return (
      <div className={'AccountLocked'}>
        <h3 className="Heading">Metamask Account Locked</h3>
        <img type="svg" height="124" width="112" src="/assets/od_metamask_big.svg"/>
        <span> Unlock your Account on the Extension </span>
      </div>
    );
  }
}

AccountLocked.displayName = 'AccountLocked';
AccountLocked.propTypes = propTypes;
AccountLocked.defaultProps = defaultProps;
export default AccountLocked;
