/* eslint-env jest */
import React from 'react'
import { mount } from 'enzyme'
import MockDate from 'mockdate'
import { unwrap } from '@material-ui/core/test-utils'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import TimeInput from './TimeInput'
import Clock from './Clock'
import * as testUtils from '../test/utils'

describe('<TimeInput />', () => {
  describe('24h', () => {
    it('matches the snapshot', () => {
      const originalGetHours = Date.prototype.getHours
      Date.prototype.getHours = Date.prototype.getUTCHours // eslint-disable-line
      const tree = mount(<TimeInput initialTime={new Date('2017-10-15T13:37Z')} mode='24h' />)
      expect(tree).toMatchSnapshot()
      Date.prototype.getHours = originalGetHours // eslint-disable-line
    })

    it('displays the formatted time', () => {
      const tree = mount(<TimeInput value={new Date(2017, 10, 15, 13, 37, 0, 0)} mode='24h' />)
      expect(getValue(tree)).toBe('13:37')

      const tree2 = mount(<TimeInput value={new Date(2017, 10, 15, 1, 23, 0, 0)} mode='24h' />)
      expect(getValue(tree2)).toBe('01:23')
    })

    it('disables the input if the disabled prop is set to true', () => {
      const tree = mount(<TimeInput value={new Date(2017, 10, 15, 13, 37, 0, 0)} mode='24h' disabled />)
      expect(tree.find(Input).prop('disabled')).toBe(true)
    })
  })

  describe('12h', () => {
    it('matches the snapshot', () => {
      const originalGetHours = Date.prototype.getHours
      Date.prototype.getHours = Date.prototype.getUTCHours // eslint-disable-line
      const tree = mount(<TimeInput initialTime={new Date('2017-10-15T13:37Z')} mode='12h' />)
      expect(tree).toMatchSnapshot()
      Date.prototype.getHours = originalGetHours // eslint-disable-line
    })

    it('displays the formatted time', () => {
      const tree = mount(<TimeInput value={new Date(2017, 10, 15, 13, 37, 0, 0)} mode='12h' />)
      expect(getValue(tree)).toBe('1:37 pm')

      const tree2 = mount(<TimeInput value={new Date(2017, 10, 15, 1, 23, 0, 0)} mode='12h' />)
      expect(getValue(tree2)).toBe('1:23 am')

      const tree3 = mount(<TimeInput value={new Date(2017, 10, 15, 0, 0, 0, 0)} mode='12h' />)
      expect(getValue(tree3)).toBe('12:00 am')

      const tree4 = mount(<TimeInput value={new Date(2017, 10, 15, 0, 0, 0, 0)} mode='12h' />)
      expect(getValue(tree4)).toBe('12:00 am')
    })
  })

  describe('controlled mode', () => {
    it('supports controlled mode', () => {
      const tree = mount(<TimeInput value={new Date(2017, 10, 15, 13, 37, 0, 0)} mode='24h' />)
      expect(getValue(tree)).toBe('13:37')

      tree.setProps({ value: new Date(2017, 10, 15, 14, 42, 0, 0) })
      expect(getValue(tree)).toBe('14:42')
    })

    it('displays no value if the value is null', () => {
      const tree = mount(<TimeInput value={null} />)
      expect(getValue(tree)).toBe('')
    })
  })

  describe('uncontrolled mode', () => {
    afterEach(() => {
      MockDate.reset()
    })

    it('supports uncontrolled mode with a default value', () => {
      const tree = mount(<TimeInput defaultValue='--:--' mode='24h' />)
      expect(getValue(tree)).toBe('--:--')
    })

    it('supports uncontrolled mode with an initial time', () => {
      const tree = mount(<TimeInput initialTime={new Date(2017, 10, 15, 13, 37, 0, 0)} mode='24h' />)
      expect(getValue(tree)).toBe('13:37')
    })

    it('supports a null defaultValue', () => {
      const tree = mount(<TimeInput defaultValue={null} mode='24h' />)

      expect(getValue(tree)).toBe('')
    })

    it('uses the current time if no value or default value is set', () => {
      MockDate.set(new Date(2017, 10, 15, 13, 37, 0, 0))
      const tree = mount(<TimeInput mode='24h' />)
      expect(getValue(tree)).toBe('13:37')
    })
  })

  describe('TimePicker dialog', () => {
    it('opens when clicking the input', () => {
      const UnstyledTimeInput = unwrap(TimeInput)
      const tree = mount(<UnstyledTimeInput classes={{}} />)
      tree.simulate('click')
      expect(tree.state('open')).toBe(true)
    })

    it('opens when clicking the input if it is disabled', () => {
      const UnstyledTimeInput = unwrap(TimeInput)
      const tree = mount(<UnstyledTimeInput classes={{}} disabled />)
      tree.simulate('click')
      expect(tree.state('open')).toBe(false)
    })

    it('closes when clicking ok', () => {
      const UnstyledTimeInput = unwrap(TimeInput)
      const tree = mount(<UnstyledTimeInput classes={{}} />)
      tree.simulate('click')
      tree.find(Button).at(1).simulate('click')
      expect(tree.state('open')).toBe(false)
    })

    it('updates uses the new time when clicking ok', () => {
      const changeHandler = jest.fn()
      MockDate.set(new Date(2017, 10, 15, 13, 37, 0, 0))
      const tree = mount(<TimeInput classes={{}} mode='24h' onChange={changeHandler} />)

      tree.simulate('click')
      getCircle(tree.find(Clock))
        .simulate('click', testUtils.stubClickEvent(128, 30)) // click on 12
        .simulate('mouseup', testUtils.stubClickEvent(128, 30)) // click on 12
      tree.find(Button).at(1).simulate('click')

      expect(getValue(tree)).toBe('12:37')
      expect(changeHandler).toHaveBeenCalled()
      const time = changeHandler.mock.calls[0][0]
      expect(time.getHours()).toBe(12)
      expect(time.getMinutes()).toBe(37)
    })

    it('closes when clicking cancel', () => {
      const tree = mount(<TimeInput />)
      tree.simulate('click')
      tree.find(Button).at(0).simulate('click')
    })

    it('discards the new time when clicking cancel', () => {
      const changeHandler = jest.fn()
      MockDate.set(new Date(2017, 10, 15, 13, 37, 0, 0))
      const tree = mount(<TimeInput classes={{}} mode='24h' onChange={changeHandler} />)

      tree.simulate('click')
      getCircle(tree.find(Clock))
        .simulate('click', testUtils.stubClickEvent(128, 30)) // click on 12
        .simulate('mouseup', testUtils.stubClickEvent(128, 30)) // click on 12
      tree.find(Button).at(0).simulate('click')

      expect(getValue(tree)).toBe('13:37') // unchanged
      expect(changeHandler).not.toHaveBeenCalled()
    })
  })
})

function getValue (timeInput) {
  return timeInput.find('input[type="text"]').getDOMNode().value
}

function getCircle (clock) {
  return clock.childAt(0).children('div').childAt(0)
}
