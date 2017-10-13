import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';

import './TradeDetailsInfoBox.scss';
import {formatNumber} from '../helpers';
import tokenFormat from '../utils/tokenFormat';


const propTypes = PropTypes && {
  transactionInfo: PropTypes.shape({
    market: PropTypes.string,
    tokenPrice: PropTypes.number,
    transactionFee: PropTypes.number,
    tokenPriceUnitSymbol: PropTypes.string
  })
};
const defaultProps = {};


class TradeDetailsInfoBox extends PureComponent {
  render() {
    const {
      transactionInfo: {
        market,
        tokenPrice,
        transactionFee,
        tokenPriceUnitSymbol
      }
    } = this.props;

    const isHidden =
        !Object.entries(
            this.props.transactionInfo
        ).length ? 'TradeDetailsInfoBox--hidden': '';

    const className = `TradeDetailsInfoBox ${isHidden}`;


    return (
      <div className={className}>
        <span>
          <span className='Value'>{market}</span>
        </span>
        <span>
          <span className="Label">Price </span>
          <span className='Value'>{tokenFormat(tokenPrice)} {tokenPriceUnitSymbol}</span>
        </span>
        <span>
          <span className="Label">Fee </span>
          <span className='Value'>{tokenFormat(transactionFee)} ETH</span>
        </span>
      </div>
    );
  }
}

TradeDetailsInfoBox.displayName = 'TradeDetailsInfoBox';
TradeDetailsInfoBox.propTypes = propTypes;
TradeDetailsInfoBox.defaultProps = defaultProps;
export default TradeDetailsInfoBox;
