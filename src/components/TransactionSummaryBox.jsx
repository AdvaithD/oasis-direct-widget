import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';

import './TransactionSummaryBox.scss';
import Pictogram from './Pictogram';
import {
  TRANSACTION_STATUS_CONFIRMED,
  TRANSACTION_STATUS_PENDING,
  TRANSACTION_STATUS_SIGNED, TRANSACTION_STATUS_WAITING,
  TRANSACTION_TYPE_BUY, TRANSACTION_TYPE_CREATE_PROXY_ACC,
  TRANSACTION_TYPE_DEPOSIT,
} from '../store/reducers/system';




const propTypes = PropTypes && {
  type: PropTypes.oneOf(
    [
      TRANSACTION_TYPE_BUY,
      TRANSACTION_TYPE_DEPOSIT,
      TRANSACTION_TYPE_CREATE_PROXY_ACC
    ]
  ),
  status: PropTypes.oneOf(
    [
      TRANSACTION_STATUS_SIGNED,
      TRANSACTION_STATUS_WAITING,
      TRANSACTION_STATUS_PENDING,
      TRANSACTION_STATUS_CONFIRMED
    ]
  ),
  amount: PropTypes.number.isRequired,
  token: PropTypes.string,
  symbol: PropTypes.string
};
const defaultProps = {};



class TransactionSummaryBox extends PureComponent {

  static getTransactionTypeLabel(t) {
    switch (t) {
      case TRANSACTION_TYPE_CREATE_PROXY_ACC: return 'Creating';

      case TRANSACTION_TYPE_BUY: return 'Buying';
      case TRANSACTION_TYPE_DEPOSIT: return 'Approving';
      default:
    }
  }

  static getTransactionStatusLabel(t) {
    switch (t) {
      case TRANSACTION_STATUS_WAITING:   return 'waiting';
      case TRANSACTION_STATUS_PENDING:   return 'pending';
      case TRANSACTION_STATUS_SIGNED:      return 'sign trans.';
      case TRANSACTION_STATUS_CONFIRMED: return 'confirmed';
      default:
        return null;
    }
  }

  getTransactionPictogram(){
    const { token, type } = this.props;
    switch (type) {
      case TRANSACTION_TYPE_CREATE_PROXY_ACC:
        return (<Pictogram symbol={'account'}/>)
    }
    return (<Pictogram symbol={token}/>);
  }

  getAmountSectionBody() {
    const { amount, token, type } = this.props;
    switch (type) {
      case TRANSACTION_TYPE_BUY:
        return (<div className="TypeBuy">~{amount} {token}</div>);
      case TRANSACTION_TYPE_DEPOSIT:
        return (<div className="TypeDeposit">{amount} {token}</div>);
      case TRANSACTION_TYPE_CREATE_PROXY_ACC:
        return (<div className="TypeAccountCreate">Account</div>);
    }
  }

  render() {

    const {
      type,
      status,
    } = this.props;

    return (
      <div className="TransactionReceipt">
        <div className="TransactionDetails">
          <div className="Pictogram">{this.getTransactionPictogram()}</div>
          <div className="TransactionAmount">
            <div className="Label">
              {TransactionSummaryBox.getTransactionTypeLabel(type)}
            </div>
            <div className="Value">{this.getAmountSectionBody()}</div>
          </div>
          <div className="TransactionStatus">
            <div className="Label">Status</div>
            <div className="Value">
              {TransactionSummaryBox.getTransactionStatusLabel(status)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TransactionSummaryBox.displayName = 'TransactionSummaryBox';
TransactionSummaryBox.propTypes = propTypes;
TransactionSummaryBox.defaultProps = defaultProps;
export default TransactionSummaryBox;
