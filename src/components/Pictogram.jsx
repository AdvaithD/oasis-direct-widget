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
  trade: (<img alt="arrow" src="/assets/od-icons/od_transition_arrow.svg"/>),
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
