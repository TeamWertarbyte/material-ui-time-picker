/* eslint-env jest */
import React from 'react'
import { mount } from 'enzyme'
import MockDate from 'mockdate'
import * as testUtils from '../test/utils'
import TimePicker from './TimePicker'

describe('<TimePicker />', () => {
  it('supports controlled mode', () => {
    const tree = mount(<TimePicker value={new Date(2017, 10, 15, 13, 37, 0, 0)} mode='24h' />)
    expect(tree.findWhere((e) => e.type() === 'div' && testUtils.hasClass(/^TimePicker-header-/)(e)).text()).toBe('13:37')

    tree.setProps({ value: new Date(2017, 10, 15, 14, 42, 0, 0) })
    expect(tree.findWhere((e) => e.type() === 'div' && testUtils.hasClass(/^TimePicker-header-/)(e)).text()).toBe('14:42')
  })

  describe('uncontrolled mode', () => {
    afterEach(() => {
      MockDate.reset()
    })

    it('supports uncontrolled mode with a default value', () => {
      const tree = mount(<TimePicker defaultValue={new Date(2017, 10, 15, 13, 37, 0, 0)} mode='24h' />)
      expect(tree.findWhere((e) => e.type() === 'div' && testUtils.hasClass(/^TimePicker-header-/)(e)).text()).toBe('13:37')
    })

    it('uses the current time if no value or default value is set', () => {
      MockDate.set(new Date(2017, 10, 15, 13, 37, 0, 0))
      const tree = mount(<TimePicker mode='24h' />)
      expect(tree.findWhere((e) => e.type() === 'div' && testUtils.hasClass(/^TimePicker-header-/)(e)).text()).toBe('13:37')
    })
  })

  describe('12h', () => {
    it('matches the snapshot', () => {
      const originalGetHours = Date.prototype.getHours
      Date.prototype.getHours = Date.prototype.getUTCHours // eslint-disable-line
      const tree = mount(
        <TimePicker mode='12h' value={new Date('2017-10-15T13:37Z')} />
      )
      expect(tree).toMatchSnapshot()
      Date.prototype.getHours = originalGetHours // eslint-disable-line
    })

    it('starts with the hour selection', () => {
      const date = new Date(2017, 10, 15, 13, 37, 0, 0)
      const tree = mount(
        <TimePicker mode='12h' value={date} />
      )
      const clock = getClock(tree)
      expect(clock.parent().props().mode).toBe('12h')
    })

    it('changes the value and the clock mode correctly', () => {
      jest.useFakeTimers()
      const changeHandler = jest.fn()
      const date = new Date(2017, 10, 15, 13, 37, 0, 0)
      const tree = mount(
        <TimePicker mode='12h' value={date} onChange={changeHandler} />
      )

      // hour selection
      getClock(tree).findWhere((e) => e.type() === 'div' && testUtils.hasClass(/^Clock-circle/)(e))
        .simulate('click', testUtils.stubClickEvent(128, 30)) // click on 12
        .simulate('mouseup', testUtils.stubClickEvent(128, 30)) // click on 12

      expect(changeHandler).toBeCalled()
      expect(changeHandler.mock.calls[0][0].getHours()).toBe(12)
      expect(changeHandler.mock.calls[0][0].getMinutes()).toBe(37)

      jest.runAllTimers()
      tree.update()
      expect(getClock(tree).props().mode).toBe('minutes')

      // minute selection
      changeHandler.mockClear()
      getClock(tree).findWhere((e) => e.type() === 'div' && testUtils.hasClass(/^Clock-circle/)(e))
      .simulate('click', testUtils.stubClickEvent(190, 230)) // click on 25
      .simulate('mouseup', testUtils.stubClickEvent(190, 230)) // click on 25

      expect(changeHandler).toBeCalled()
      expect(changeHandler.mock.calls[0][0].getHours()).toBe(12)
      expect(changeHandler.mock.calls[0][0].getMinutes()).toBe(25)
    })

    it('calls onMinutesSelected after selecting the minutes', () => {
      jest.useFakeTimers()
      const onMinutesSelected = jest.fn()
      const tree = mount(
        <TimePicker mode='12h' onMinutesSelected={onMinutesSelected} />
      )
      getClock(tree).findWhere((e) => e.type() === 'div' && testUtils.hasClass(/^Clock-circle/)(e))
      .simulate('click', testUtils.stubClickEvent(128, 30)) // click on 12
      .simulate('mouseup', testUtils.stubClickEvent(128, 30)) // click on 12
      jest.runAllTimers()
      tree.update()
      getClock(tree).findWhere((e) => e.type() === 'div' && testUtils.hasClass(/^Clock-circle/)(e))
      .simulate('click', testUtils.stubClickEvent(190, 230)) // click on 25
      .simulate('mouseup', testUtils.stubClickEvent(190, 230)) // click on 25
      jest.runAllTimers()

      expect(onMinutesSelected).toHaveBeenCalledTimes(1)
    })

    it('can toggle between editing the hours and the minutes', () => {
      const tree = mount(
        <TimePicker mode='12h' value={new Date(2017, 10, 15, 13, 37, 0, 0)} />
      )

      tree.findWhere((e) => e != null && e.getDOMNode() != null && e.text() === '37')
        .simulate('click') // click on minutes
      expect(getClock(tree).props().mode).toBe('minutes')

      tree.findWhere((e) => e != null && e.getDOMNode() != null && e.text() === '01')
        .simulate('click') // click on hours
      expect(getClock(tree).props().mode).toBe('12h')
    })

    it('supports toggling between am and pm', () => {
      const changeHandler = jest.fn()
      let tree = mount(
        <TimePicker mode='12h' value={new Date(2017, 10, 15, 13, 37, 0, 0)} onChange={changeHandler} />
      )

      // 13:37 = 1:37 pm --> 01:37
      tree.findWhere((e) => e != null && e.getDOMNode() != null && e.text() === 'AM')
        .simulate('click')
      expect(changeHandler).toBeCalled()
      expect(changeHandler.mock.calls[0][0].getHours()).toBe(1)
      expect(changeHandler.mock.calls[0][0].getMinutes()).toBe(37)

      // 01:37 = 1:37 am --> 13:37
      changeHandler.mockClear()
      tree.findWhere((e) => e != null && e.getDOMNode() != null && e.text() === 'PM')
        .simulate('click')
      expect(changeHandler).toBeCalled()
      expect(changeHandler.mock.calls[0][0].getHours()).toBe(13)
      expect(changeHandler.mock.calls[0][0].getMinutes()).toBe(37)

      tree = mount(
        <TimePicker mode='12h' value={new Date(2017, 10, 15, 1, 37, 0, 0)} onChange={changeHandler} />
      )
      // 01:37 = 1:37 am --> 01:37
      changeHandler.mockClear()
      tree.findWhere((e) => e != null && e.getDOMNode() != null && e.text() === 'AM')
        .simulate('click')
      expect(changeHandler).not.toBeCalled()

      tree = mount(
        <TimePicker mode='12h' value={new Date(2017, 10, 15, 13, 37, 0, 0)} onChange={changeHandler} />
      )
      // 13:37 = 1:37 pm --> 13:37
      changeHandler.mockClear()
      tree.findWhere((e) => e != null && e.getDOMNode() != null && e.text() === 'PM')
        .simulate('click')
      expect(changeHandler).not.toBeCalled()
    })

    it('does not switch from am to pm when selecting 12 hours', () => {
      const changeHandler = jest.fn()
      let tree = mount(
        <TimePicker mode='12h' value={new Date(2017, 10, 15, 1, 23, 0, 0)} onChange={changeHandler} />
      )

      getClock(tree).findWhere((e) => e.type() === 'div' && testUtils.hasClass(/^Clock-circle/)(e))
      .simulate('click', testUtils.stubClickEvent(128, 30)) // click on 12

      expect(changeHandler).toHaveBeenCalled()
      const time = changeHandler.mock.calls[0][0]
      expect(time.getHours()).toBe(0)
    })

    it('does not switch from am to pm when changing the hours', () => {
      const changeHandler = jest.fn()
      let tree = mount(
        <TimePicker mode='12h' value={new Date(2017, 10, 15, 1, 23, 0, 0)} onChange={changeHandler} />
      )

      getClock(tree).findWhere((e) => e.type() === 'div' && testUtils.hasClass(/^Clock-circle/)(e))
      .simulate('click', testUtils.stubClickEvent(250, 128 + 30)) // click on 3

      expect(changeHandler).toHaveBeenCalled()
      const time = changeHandler.mock.calls[0][0]
      expect(time.getHours()).toBe(3)
    })

    it('does not switch from pm to am when selecting 12 hours', () => {
      const changeHandler = jest.fn()
      let tree = mount(
        <TimePicker mode='12h' value={new Date(2017, 10, 15, 13, 37, 0, 0)} onChange={changeHandler} />
      )

      getClock(tree).findWhere((e) => e.type() === 'div' && testUtils.hasClass(/^Clock-circle/)(e))
      .simulate('click', testUtils.stubClickEvent(128, 30)) // click on 12

      expect(changeHandler).toHaveBeenCalled()
      const time = changeHandler.mock.calls[0][0]
      expect(time.getHours()).toBe(12)
    })

    it('does not switch from pm to am when changing the hours', () => {
      const changeHandler = jest.fn()
      let tree = mount(
        <TimePicker mode='12h' value={new Date(2017, 10, 15, 13, 37, 0, 0)} onChange={changeHandler} />
      )

      getClock(tree).findWhere((e) => e.type() === 'div' && testUtils.hasClass(/^Clock-circle/)(e))
      .simulate('click', testUtils.stubClickEvent(250, 128 + 30)) // click on 3

      expect(changeHandler).toHaveBeenCalled()
      const time = changeHandler.mock.calls[0][0]
      expect(time.getHours()).toBe(15)
    })
  })

  describe('24h', () => {
    it('matches the snapshot', () => {
      const originalGetHours = Date.prototype.getHours
      Date.prototype.getHours = Date.prototype.getUTCHours // eslint-disable-line
      const tree = mount(
        <TimePicker mode='24h' value={new Date('2017-10-15T13:37Z')} />
      )
      expect(tree).toMatchSnapshot()
      Date.prototype.getHours = originalGetHours // eslint-disable-line
    })

    it('starts with the hour selection', () => {
      const date = new Date(2017, 10, 15, 13, 37, 0, 0)
      const tree = mount(
        <TimePicker mode='24h' value={date} />
      )
      const clock = getClock(tree)
      expect(clock.parent().props().mode).toBe('24h')
    })

    it('changes the value and the clock mode correctly', () => {
      jest.useFakeTimers()
      const changeHandler = jest.fn()
      const date = new Date(2017, 10, 15, 13, 37, 0, 0)
      const tree = mount(
        <TimePicker mode='24h' value={date} onChange={changeHandler} />
      )

      // hour selection
      getClock(tree).findWhere((e) => e.type() === 'div' && testUtils.hasClass(/^Clock-circle/)(e))
        .simulate('click', testUtils.stubClickEvent(128, 30)) // click on 12
        .simulate('mouseup', testUtils.stubClickEvent(128, 30)) // click on 12

      expect(changeHandler).toBeCalled()
      expect(changeHandler.mock.calls[0][0].getHours()).toBe(12)
      expect(changeHandler.mock.calls[0][0].getMinutes()).toBe(37)

      jest.runAllTimers()
      tree.update()
      expect(getClock(tree).props().mode).toBe('minutes')

      // minute selection
      changeHandler.mockClear()
      getClock(tree).findWhere((e) => e.type() === 'div' && testUtils.hasClass(/^Clock-circle/)(e))
      .simulate('click', testUtils.stubClickEvent(190, 230)) // click on 25
      .simulate('mouseup', testUtils.stubClickEvent(190, 230)) // click on 25

      expect(changeHandler).toBeCalled()
      expect(changeHandler.mock.calls[0][0].getHours()).toBe(12)
      expect(changeHandler.mock.calls[0][0].getMinutes()).toBe(25)
    })

    it('calls onMinutesSelected after selecting the minutes', () => {
      jest.useFakeTimers()
      const onMinutesSelected = jest.fn()
      const tree = mount(
        <TimePicker mode='24h' onMinutesSelected={onMinutesSelected} />
      )
      getClock(tree).findWhere((e) => e.type() === 'div' && testUtils.hasClass(/^Clock-circle/)(e))
      .simulate('click', testUtils.stubClickEvent(128, 30)) // click on 12
      .simulate('mouseup', testUtils.stubClickEvent(128, 30)) // click on 12
      jest.runAllTimers()
      tree.update()
      getClock(tree).findWhere((e) => e.type() === 'div' && testUtils.hasClass(/^Clock-circle/)(e))
      .simulate('click', testUtils.stubClickEvent(190, 230)) // click on 25
      .simulate('mouseup', testUtils.stubClickEvent(190, 230)) // click on 25
      jest.runAllTimers()

      expect(onMinutesSelected).toHaveBeenCalledTimes(1)
    })

    it('can toggle between editing the hours and the minutes', () => {
      const tree = mount(
        <TimePicker mode='24h' value={new Date(2017, 10, 15, 13, 37, 0, 0)} />
      )

      tree.findWhere((e) => e != null && e.getDOMNode() != null && e.text() === '37')
        .simulate('click') // click on minutes
      expect(getClock(tree).props().mode).toBe('minutes')

      tree.findWhere((e) => e != null && e.getDOMNode() != null && e.text() === '13')
        .simulate('click') // click on hours
      expect(getClock(tree).props().mode).toBe('24h')
    })
  })
})

function getClock (picker) {
  return picker.findWhere((e) => e.name() === 'Clock')
}
