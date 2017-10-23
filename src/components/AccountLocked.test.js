/* global shallow describe it expect */
/* eslint-disable import/first */
import React from 'react';

import AccountLocked from './AccountLocked';


describe('(Component) AccountLocked', () => {
  it('should render', () => {
    const props = {
      children: (
        <span>test</span>
      )
    };
    const wrapper = shallow(
      <AccountLocked {...props}/>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
