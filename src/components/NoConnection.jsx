import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';

import './NoConnection.scss';


const propTypes = PropTypes && {
  children: PropTypes.node
};
const defaultProps = {};


class NoConnection extends PureComponent {
  render() {
    return (
        <div className="Frame">
          <div className="Connectionless">
            <div className="Heading">
              <h2>Not Connected to Ethereum</h2>
            </div>
            <div className="Content">
              <div className="Heading">
                <h3 >Available clients</h3>
              </div>
              <div className="List">
                <ul>
                  <li>
                    <div>
                      <img type="svg" src="/assets/od_metamask.svg"/>
                    </div>
                    <div>
                      <h4 className="Heading"> Metamask </h4>
                      <span> Browser Extension</span>
                    </div>
                    <div>
                      <a href="https://metamask.io">INSTALL</a>
                    </div>
                  </li>
                  <li>
                    <div>
                      <img type="svg" src="/assets/od_mist.svg"/>
                    </div>
                    <div>
                      <h4 className="Heading"> Mist </h4>
                      <span> Ethereum Client</span>
                    </div>
                    <div>
                      <a href="https://github.com/ethereum/mist">INSTALL</a>
                    </div>
                  </li>
                  <li>
                    <div>
                      <img type="svg" src="/assets/od_parity.svg"/>
                    </div>
                    <div>
                      <h4 className="Heading"> Parity </h4>
                      <span>Ethereum client + Browser Extension</span>
                    </div>
                    <div>
                      <a href="https://parity.io/">INSTALL</a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

NoConnection.displayName = 'NoConnection';
NoConnection.propTypes = propTypes;
NoConnection.defaultProps = defaultProps;
export default NoConnection;