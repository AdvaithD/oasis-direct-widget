import React, {PureComponent} from 'react';
import {PropTypes} from 'prop-types';

import web3 from '../web3'
import './AmountInput.scss';

const propTypes = PropTypes && {
    name: PropTypes.string.isRequired,
    placeHolder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number,
    selectedTokens: PropTypes.object.isRequired
  };
const defaultProps = {};


function getContainerClass(errors) {
  const className = 'TakerTokenAmount';
  if(hasErrors(errors)) {
    return className.concat(' TakerTokenAmount--hasErrors');
  }
  return className;
}

function hasErrors(errors) {
  if(!errors) return false;
  return Object.values(errors).some(v => v === true)
}

class AmountInput extends PureComponent {
  inputRef = null;

  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  onValueChange() {
    console.log(this.inputRef);
    const {
      name,
      selectedTokens: {buy, deposit}, appState,
      errors
    } = this.props;
    switch (name) {
      case 'buy':
        this.props.onChange(
            deposit, buy, this.inputRef.value, appState, hasErrors(errors)
        );
        break;
      case 'deposit':
        this.props.onChange(
            deposit, buy, this.inputRef.value, appState, hasErrors(errors)
        );

        break;
    }
    if (!this.inputRef.hasFocus) {
      const controlValueNumber = Number(this.inputRef.value);
      if(!isNaN(controlValueNumber) && controlValueNumber > 0) {
        this.inputRef.value = web3.toBigNumber(this.inputRef.value).toFormat(5)
      }

    }
  }

  onBlur(e) {
    const { placeHolder } = this.props;
    const controlValueNumber = Number(this.inputRef.value);
    e.target.placeholder = placeHolder;
    if(!isNaN(controlValueNumber) && controlValueNumber > 0) {
      this.inputRef.value = web3.toBigNumber(this.inputRef.value).toFormat(5)
    }
  }

  onFocus(e) {
    e.target.placeholder = "";
  }

  render() {
    const {
      name, value, placeHolder, errors, controlDisabled
    } = this.props;

    const getValue = (v) => {
      console.log('getValue', v);
      return v ? v : '';
    };
    return (
        <div className={getContainerClass(errors)}>
          <div className='Errors'>
            <div className='OverTheLimit'>Insufficient funds</div>
          </div>
          <input
              ref={(ref) => this.inputRef = ref}
              disabled={controlDisabled}
              type="number"
              step={.0001} min={.0001}
              onChange={this.onValueChange}
              name={name}
              placeholder={placeHolder}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              value={getValue(value)}
          />
        </div>
    );
  }
}

AmountInput.displayName = 'AmountInput';
AmountInput.propTypes = propTypes;
AmountInput.defaultProps = defaultProps;
export default AmountInput;
