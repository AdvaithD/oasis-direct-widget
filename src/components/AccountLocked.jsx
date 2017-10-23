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
        Account is locked
      </div>
    );
  }
}

AccountLocked.displayName = 'AccountLocked';
AccountLocked.propTypes = propTypes;
AccountLocked.defaultProps = defaultProps;
export default AccountLocked;
