import React, {PureComponent} from 'react';
import {PropTypes} from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';

import './AmountInput.scss';


const propTypes = PropTypes && {
    name: PropTypes.string.isRequired,
    placeHolder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number
  };
const defaultProps = {};

class AmountInput extends PureComponent {

  constructor(props) {
    super(props);
    this.onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(v) { this.props.onChange(v); }

  render() {
    const {
      name,
      value,
      placeHolder
    } = this.props;

    const getValue = (v) => value ? parseFloat(value) : '';
    return (
      <div className='TakerTokenAmount'>
        <input type="number"
               onChange={this.onValueChange}
               name={name} placeholder={placeHolder}
               onFocus={(e) => e.target.placeholder = ""}
               onBlur={(e) => e.target.placeholder = placeHolder}
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
