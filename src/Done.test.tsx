import { mount } from 'enzyme';
import * as React from 'react';
import Done from './Done';

it('renders correctly', () => {
    const wrapper = mount(<Done />);
    expect(wrapper).toMatchSnapshot();
});
