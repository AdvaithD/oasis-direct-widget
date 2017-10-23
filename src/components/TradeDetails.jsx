import React, {PureComponent} from 'react';
import {PropTypes} from 'prop-types';

import './TradeDetails.scss';
import TradeToken from '../components/TradeToken';
import AmountInput from './AmountInput';
import Pictogram from './Pictogram';
import TokenPickerContainer from './../containers/TokenPicker'
import TradeDetailsInfoWrapper from '../containers/TradeDetailsInfo';
import {formatNumber} from '../helpers';


const Button  = ({disabled, type, text, onClick}) => (
    <button
        onClick={onClick} disabled={disabled}
        className={'Button'} type={type||'button'}>{text}
    </button>
);

const propTypes = PropTypes && {
  onBuyAmountChange: PropTypes.func.isRequired,
  onDepositAmountChange: PropTypes.func.isRequired,
  onStartTransaction: PropTypes.func.isRequired,
  onToggleTokenPicker: PropTypes.func.isRequired,
  depositTokenValue: PropTypes.string.isRequired,
  buyTokenValue: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  depositTokenAmount: PropTypes.number,
  buyTokenAmount: PropTypes.number,
  buyAmountErrors: PropTypes.object,
  depositAmountErrors: PropTypes.object
};
const defaultProps = {};

class TradeDetails extends PureComponent {
  render() {
    const {
      onBuyAmountChange,
      onDepositAmountChange,
      onStartTransaction,
      onToggleTokenPicker,
      depositTokenValue,
      buyTokenValue,
      disabled,
      depositTokenAmount,
      buyTokenAmount,
      appState,
      buyAmountErrors,
      depositAmountErrors,
      isBuyAmountControlDisabled,
      isDepositAmountControlDisabled

    } = this.props;

    const selectedTokens = {deposit: depositTokenValue, buy: buyTokenValue};
    return (
      <section className={'TradeDetails'}>
        <TokenPickerContainer/>
        <div className="Heading">
          <h3>Choose which Assets to trade</h3>
        </div>
        <div>
          <form>
            <div>
              <div className='TradeTokenSelector'>
                <TradeToken
                  onToggleTokenPicker={onToggleTokenPicker}
                  controlName={'deposit'}
                  tokenSymbol={depositTokenValue}
                />
                <AmountInput
                  selectedTokens={selectedTokens}
                  errors={depositAmountErrors}
                  value={depositTokenAmount}
                  onChange={onDepositAmountChange}
                  name="deposit"
                  controlDisabled={isDepositAmountControlDisabled}
                  placeHolder="Deposit Amount"
                />
              </div>
              <div className="Separator">
                <Pictogram symbol={'trade'}/>
              </div>
              <div className='TradeTokenSelector'>
                <TradeToken
                  onToggleTokenPicker={onToggleTokenPicker}
                  controlName={'buy'}
                  tokenSymbol={buyTokenValue}
                />
                <AmountInput
                  selectedTokens={selectedTokens}
                  errors={buyAmountErrors}
                  value={buyTokenAmount}
                  onChange={onBuyAmountChange}
                  name="buy"
                  controlDisabled={isBuyAmountControlDisabled}
                  placeHolder="Receive Amount"
                />
              </div>
            </div>
            <div>
              <TradeDetailsInfoWrapper/>
            </div>
            <div>
              <Button
                  disabled={disabled}
                  onClick={onStartTransaction}
                  text={'Start transaction'}
              />
            </div>
          </form>
        </div>
      </section>
    );
  }
}

TradeDetails.displayName = 'TradeDetails';
TradeDetails.propTypes = propTypes;
TradeDetails.defaultProps = defaultProps;
export default TradeDetails;