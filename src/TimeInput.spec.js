/* eslint-env jest */
import React from 'react'
import { mount } from 'enzyme'
import MockDate from 'mockdate'
import TimeInput from './TimeInput'

describe.only('<TimeInput />', () => {
  describe('24h', () => {
    it('matches the snapshot', () => {
      const tree = mount(<TimeInput defaultValue={new Date('2017-10-15T13:37Z')} mode='24h' />)
      expect(tree).toMatchSnapshot()
    })

    it('displays the formatted time', () => {
      const tree = mount(<TimeInput value={new Date(2017, 15, 14, 13, 37, 0, 0)} mode='24h' />)
      expect(getValue(tree)).toBe('13:37')

      const tree2 = mount(<TimeInput value={new Date(2017, 15, 14, 1, 23, 0, 0)} mode='24h' />)
      expect(getValue(tree2)).toBe('01:23')
    })
  })

  describe('12h', () => {
    it('matches the snapshot', () => {
      const tree = mount(<TimeInput defaultValue={new Date('2017-10-15T13:37Z')} mode='12h' />)
      expect(tree).toMatchSnapshot()
    })

    it('displays the formatted time', () => {
      const tree = mount(<TimeInput value={new Date(2017, 15, 14, 13, 37, 0, 0)} mode='12h' />)
      expect(getValue(tree)).toBe('1:37 pm')

      const tree2 = mount(<TimeInput value={new Date(2017, 15, 14, 1, 23, 0, 0)} mode='12h' />)
      expect(getValue(tree2)).toBe('1:23 am')

      const tree3 = mount(<TimeInput value={new Date(2017, 15, 14, 0, 0, 0, 0)} mode='12h' />)
      expect(getValue(tree3)).toBe('12:00 am')

      const tree4 = mount(<TimeInput value={new Date(2017, 15, 14, 0, 0, 0, 0)} mode='12h' />)
      expect(getValue(tree4)).toBe('12:00 am')
    })
  })

  it('supports controlled mode', () => {
    const tree = mount(<TimeInput value={new Date(2017, 15, 14, 13, 37, 0, 0)} mode='24h' />)
    expect(getValue(tree)).toBe('13:37')

    tree.setProps({ value: new Date(2017, 15, 14, 14, 42, 0, 0) })
    expect(getValue(tree)).toBe('14:42')
  })

  describe('uncontrolled mode', () => {
    afterEach(() => {
      MockDate.reset()
    })

    it('supports uncontrolled mode with a default value', () => {
      const tree = mount(<TimeInput defaultValue={new Date(2017, 15, 14, 13, 37, 0, 0)} mode='24h' />)
      expect(getValue(tree)).toBe('13:37')
    })

    it('uses the current time if no value or default value is set', () => {
      MockDate.set(new Date(2017, 15, 14, 13, 37, 0, 0))
      const tree = mount(<TimeInput mode='24h' />)
      expect(getValue(tree)).toBe('13:37')
    })
  })

  // TODO enzyme doesn't support portals yet, add more tests one they work
  // https://github.com/airbnb/enzyme/issues/1150
  //
  // describe('TimePicker dialog', () => {
  //   it('closes when clicking ok', () => {
  //     const tree = mount(<TimeInput />)
  //     tree.simulate('click')
  //     tree.findWhere((e) => e.getDOMNode() != null && e.text() === 'Ok').simulate('click')
  //   })
  //
  //   it('closes when clicking cancel', () => {
  //     const tree = mount(<TimeInput />)
  //     tree.findWhere((e) => e.getDOMNode() != null && e.text() === 'Cancel').simulate('click')
  //   })
  // })
})

function getValue (timeInput) {
  return timeInput.find('input[type="text"]').getDOMNode().value
}
