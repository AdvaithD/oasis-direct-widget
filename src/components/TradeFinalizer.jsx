import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';

import './TradeFinalizer.scss';
import TransactionSummaryBox from "./TransactionSummaryBox";


const propTypes = PropTypes && {
  children: PropTypes.node
};
const defaultProps = {};

const NeedHelpBox = () => (
  <div className="Footer Slogan">
    Need help? Contact us on <a href="http://chat.makerdao.com">chat.makerdao.com</a>
  </div>
);

const CurrentEstimatedPrice = ({amount, fromToken, toToken}) => (
    <div>
      Current Estimated Price
      <span className="Amount">{amount}</span>
      <span className="FromToken">{fromToken}</span>
      <span>/</span>
      <span className="ToToken">{toToken}</span>
    </div>
);


class TradeFinalizer extends PureComponent {

  getEstimatedPriceSection() {
    const {
      data
    } = this.props;
    return (
        <CurrentEstimatedPrice
            amount={data.tokenPrice}
            fromToken={data.fromToken}
            toToken={data.toToken}
        />
    );
  }

  transactions() {
    const { transactionsList } = this.props;
    return transactionsList.map(
        (t, i) => (<TransactionSummaryBox key={i} {...t}/>)
    );
  }

  render() {

    return (
      <section className={'TradeFinalizer'}>
        <div className="EstimatedPrice">
          {this.getEstimatedPriceSection()}
        </div>
        <div className="Heading">
          <h3>Finalize trade</h3>
        </div>
        <div className="TransactionsList">
          {this.transactions()}
        </div>
        <div className="FooterContainer">
          <NeedHelpBox/>
        </div>
      </section>
    );
  }
}

TradeFinalizer.displayName = 'TradeFinalizer';
TradeFinalizer.propTypes = propTypes;
TradeFinalizer.defaultProps = defaultProps;
export default TradeFinalizer;
