import React, {PureComponent} from 'react';

export class Golem extends PureComponent {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" className="GolemToken">
        <g fill="none" fill-rule="evenodd">
          <path className="GolemToken" fill-rule="nonzero"
                d="M14,0 C6.26794317,0 0,6.26813493 0,14 C0,21.7321121 6.26794317,28 14,28 C21.7319333,28 28,21.7321121 28,14 C28,6.26813493 21.7319333,0 14,0 Z"/>
          <ellipse cx="13.806" cy="18.283" stroke="#FFF" stroke-width="1.025" rx="2.864" ry="2.691"/>
          <path stroke="#FFF" stroke-linecap="square" stroke-width="1.025"
                d="M13.944664,13.0280992 L13.944664,15.2196503"/>
          <ellipse cx="13.806" cy="10.08" stroke="#FFF" stroke-width="1.025" rx="2.864" ry="2.691"/>
          <path stroke="#FFF" stroke-linecap="square" stroke-width="1.025"
                d="M17.6323711,6.61085361 L15.9596547,8.16051424"/>
        </g>
      </svg>
    )
  }
}