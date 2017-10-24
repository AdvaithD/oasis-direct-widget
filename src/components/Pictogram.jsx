import React, {PureComponent} from 'react';
import {PropTypes} from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';

import './Pictogram.scss';
import {Ether} from "./tokens/Ether";
import {Maker} from "./tokens/Maker";
import {Augur} from "./tokens/Augur";
import {Golem} from "./tokens/Golem";
import {Digix} from "./tokens/Digix";
import {Sai} from "./tokens/Sai";


const tags = {
  WETH: (<Ether/>),
  MKR: (<Maker/>),
  REP: (<Augur/>),
  GNT: (<Golem/>),
  DGX: (<Digix/>),
  SAI: (<Sai/>),
  swap: (<img alt="swap icon" src="/assets/od-icons/od_swap_arrow.svg"/>),
  arrow: (<img alt="arrow icon" src="/assets/od-icons/od_arrow.svg"/>),
  done: (<img alt="tick icon " src="/assets/od-icons/od_done.svg"/>),
  profile: (<img alt="profile icon" src="/assets/od-icons/od_done.svg"/>),
  alert: (<img alt="alert icon" src="/assets/od-icons/od_alert.svg"/>),
};

const propTypes = PropTypes && {
    size: PropTypes.number,
    symbol: PropTypes.oneOf(Object.keys(tags)),
  };

const defaultProps = {};


class Pictogram extends PureComponent {
  render() {
    const {symbol} = this.props;
    return (
      <div className='Pictogram'>
        {tags[symbol]}
      </div>
    );
  }
}

Pictogram.displayName = 'Pictogram';
Pictogram.propTypes = propTypes;
Pictogram.defaultProps = defaultProps;
export default Pictogram;
