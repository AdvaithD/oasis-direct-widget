/* global shallow describe it expect */
/* eslint-disable import/first */
import React from 'react';

import NoConnection from './NoConnection';


describe('(Component) NoConnection', () => {
  it('should render', () => {
    const props = {
      children: (
        <span>test</span>
      )
    };
    const wrapper = shallow(
      <NoConnection {...props}/>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
