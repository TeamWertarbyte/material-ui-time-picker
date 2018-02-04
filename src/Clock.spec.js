/* eslint-env jest */
import React from 'react'
import { mount } from 'enzyme'
import { unwrap } from 'material-ui/test-utils'
import * as testUtils from '../test/utils'
import Clock from './Clock'

describe('<Clock />', () => {
  it('propagates unknown props through to the child component', () => {
    const callback = jest.fn()
    const tree = mount(
      <Clock mode='12h' value={7} onClick={callback} />
    )
    tree.simulate('click')
    expect(callback).toBeCalled()
  })

  it('handles clicks', () => {
    const onChangeCallback = jest.fn()
    const tree = mount(<Clock mode='24h' value={12} onChange={onChangeCallback} />)
    getCircle(tree).simulate('click', testUtils.stubClickEvent(175, 200)) // click on 17
    expect(onChangeCallback).toHaveBeenCalledWith(17)
  })

  it('handles dragging with the mouse', () => {
    const onChangeCallback = jest.fn()
    const tree = mount(<Clock mode='24h' value={12} onChange={onChangeCallback} />)
    getCircle(tree).simulate('mousemove', { buttons: 1, clientX: 175, clientY: 200 }) // drag the hand to 17
    expect(onChangeCallback).toHaveBeenCalledWith(17)
  })

  it('handles dragging with the mouse in Safari (where MouseEvent.buttons is not supported)', () => {
    const onChangeCallback = jest.fn()
    const tree = mount(<Clock mode='24h' value={12} onChange={onChangeCallback} />)
    getCircle(tree).simulate('mousemove', { which: 1, clientX: 175, clientY: 200 }) // drag the hand to 17
    expect(onChangeCallback).toHaveBeenCalledWith(17)
  })

  it('handles taps', () => {
    const onChangeCallback = jest.fn()
    const tree = mount(<Clock mode='24h' value={12} onChange={onChangeCallback} />)
    getCircle(tree).simulate('touchend', testUtils.stubTouchEndEvent(175, 200)) // tap on 17
    expect(onChangeCallback).toHaveBeenCalledWith(17)

    onChangeCallback.mockClear()
    getCircle(tree).simulate('touchmove', testUtils.stubTouchMoveEvent(175, 200)) // swipe over 17
    expect(onChangeCallback).toHaveBeenCalledWith(17)
  })

  it('takes the shortest route when moving the hand', () => {
    const tree = mount(<Clock mode='minutes' value={0} />)
    tree.setProps({ value: 5 })
    expect(getPointer(tree).getDOMNode().style.transform).toBe('rotate(-60deg)')
    tree.setProps({ value: 55 })
    expect(getPointer(tree).getDOMNode().style.transform).toBe('rotate(-120deg)')
  })

  it('disables the hand animation when moving the hand manually via touch', () => {
    const UnstyledClock = unwrap(Clock)
    const onChangeCallback = jest.fn()
    const tree = mount(<UnstyledClock classes={{}} mode='24h' value={12} onChange={onChangeCallback} />)
    getCircle(tree).simulate('touchstart')
    expect(tree.state().touching).toBe(true)
    getCircle(tree).simulate('touchend', testUtils.stubTouchEndEvent(175, 200))
    expect(tree.state().touching).toBe(false)
  })

  it('disables the hand animation when moving the hand manually via mouse', () => {
    const UnstyledClock = unwrap(Clock)
    const onChangeCallback = jest.fn()
    const tree = mount(<UnstyledClock classes={{}} mode='24h' value={12} onChange={onChangeCallback} />)
    getCircle(tree).simulate('mousedown')
    expect(tree.state().touching).toBe(true)
    getCircle(tree).simulate('mouseup')
    expect(tree.state().touching).toBe(false)
  })

  describe('24h', () => {
    it('matches the snapshot', () => {
      const tree = mount(
        <Clock mode='24h' value={7} />
      )
      expect(tree).toMatchSnapshot()
    })

    it('displays 24 hours', () => {
      const tree = mount(
        <Clock mode='24h' value={7} />
      )

      const spans = tree.find('span')
      for (let i = 1; i <= 23; i++) {
        expect(spans.findWhere((e) => e.type() === 'span' && parseInt(e.text()) === i).length).toBe(1)
      }
    })

    it('rotates the pointer to point to the selected hour', () => {
      expect(getPointer(mount(<Clock mode='24h' value={3} />)).getDOMNode().style.transform).toBe('rotate(0deg)')
      expect(getPointer(mount(<Clock mode='24h' value={6} />)).getDOMNode().style.transform).toBe('rotate(90deg)')
      expect(getPointer(mount(<Clock mode='24h' value={9} />)).getDOMNode().style.transform).toBe('rotate(180deg)')
      expect(getPointer(mount(<Clock mode='24h' value={12} />)).getDOMNode().style.transform).toBe('rotate(-90deg)')

      expect(getPointer(mount(<Clock mode='24h' value={15} />)).getDOMNode().style.transform).toBe('rotate(0deg)')
      expect(getPointer(mount(<Clock mode='24h' value={18} />)).getDOMNode().style.transform).toBe('rotate(90deg)')
      expect(getPointer(mount(<Clock mode='24h' value={21} />)).getDOMNode().style.transform).toBe('rotate(180deg)')
      expect(getPointer(mount(<Clock mode='24h' value={0} />)).getDOMNode().style.transform).toBe('rotate(-90deg)')
    })

    it('changes the pointer length when pointing to inner hours', () => {
      const isSmall = testUtils.hasClass(/-smallPointer/)

      expect(isSmall(getPointer(mount(<Clock mode='24h' value={15} />)))).toBeTruthy()
      expect(isSmall(getPointer(mount(<Clock mode='24h' value={6} />)))).toBeFalsy()

      // 12 is in the outer circle, 00 is in the inner circle
      expect(isSmall(getPointer(mount(<Clock mode='24h' value={12} />)))).toBeFalsy()
      expect(isSmall(getPointer(mount(<Clock mode='24h' value={0} />)))).toBeTruthy()
    })

    it('calls onChange when a different value is selected', () => {
      const onChangeCallback = jest.fn()
      const tree = mount(<Clock mode='24h' value={11} onChange={onChangeCallback} />)
      getCircle(tree).simulate('click', testUtils.stubClickEvent(175, 200)) // click on 17
      expect(onChangeCallback).toHaveBeenCalledWith(17)

      onChangeCallback.mockClear()
      getCircle(tree).simulate('click', testUtils.stubClickEvent(35, 70)) // click on 10
      expect(onChangeCallback).toHaveBeenCalledWith(10)

      onChangeCallback.mockClear()
      getCircle(tree).simulate('click', testUtils.stubClickEvent(128 + 5, 30)) // click on 12, but a little more right
      expect(onChangeCallback).toHaveBeenCalledWith(12)

      onChangeCallback.mockClear()
      getCircle(tree).simulate('click', testUtils.stubClickEvent(128 + 5, 64)) // click on 0, but a little more right
      expect(onChangeCallback).toHaveBeenCalledWith(0)
    })
  })

  describe('12h', () => {
    it('matches the snapshot', () => {
      const tree = mount(
        <Clock mode='12h' value={7} />
      )
      expect(tree).toMatchSnapshot()
    })

    it('displays 12 hours', () => {
      const tree = mount(
        <Clock mode='12h' value={7} />
      )

      const spans = tree.find('span')
      for (let i = 1; i <= 12; i++) {
        expect(spans.findWhere((e) => e.type() === 'span' && parseInt(e.text()) === i).length).toBe(1)
      }
    })

    it('rotates the pointer to point to the selected hour', () => {
      expect(getPointer(mount(<Clock mode='12h' value={3} />)).getDOMNode().style.transform).toBe('rotate(0deg)')
      expect(getPointer(mount(<Clock mode='12h' value={6} />)).getDOMNode().style.transform).toBe('rotate(90deg)')
      expect(getPointer(mount(<Clock mode='12h' value={9} />)).getDOMNode().style.transform).toBe('rotate(180deg)')
      expect(getPointer(mount(<Clock mode='12h' value={12} />)).getDOMNode().style.transform).toBe('rotate(270deg)')
    })

    it('calls onChange when a different value is selected', () => {
      const onChangeCallback = jest.fn()
      const tree = mount(<Clock mode='12h' value={12} onChange={onChangeCallback} />)

      getCircle(tree).simulate('click', testUtils.stubClickEvent(250, 128)) // click on 3
      expect(onChangeCallback).toHaveBeenCalledWith(3)
    })

    it('only calls onChange if the value actually changed', () => {
      const onChangeCallback = jest.fn()
      const tree = mount(<Clock mode='12h' value={12} onChange={onChangeCallback} />)

      getCircle(tree).simulate('click', testUtils.stubClickEvent(128, 30)) // click on 12
      expect(onChangeCallback).not.toHaveBeenCalled()
    })
  })

  describe('minutes', () => {
    it('matches the snapshot', () => {
      const tree = mount(
        <Clock mode='minutes' value={42} />
      )
      expect(tree).toMatchSnapshot()
    })

    it('displays minutes in 5 min steps, starting with 00', () => {
      const tree = mount(
        <Clock mode='minutes' value={42} />
      )

      const spans = tree.find('span')
      expect(spans.findWhere((e) => e.type() === 'span' && e.text() === '00').length).toBe(1)
      for (let i = 1; i <= 11; i++) {
        expect(spans.findWhere((e) => e.type() === 'span' && parseInt(e.text()) === i * 5).length).toBe(1)
      }
    })

    it('displays a different pointer for odd minutes', () => {
      const evenTree = mount(
        <Clock mode='minutes' value={40} />
      )
      const evenPointer = getPointer(evenTree)

      const oddTree = mount(
        <Clock mode='minutes' value={42} />
      )
      const oddPointer = getPointer(oddTree)

      expect(evenPointer.html()).not.toBe(oddPointer.html())
    })

    it('rotates the pointer to point to the selected minutes', () => {
      expect(getPointer(mount(<Clock mode='minutes' value={0} />)).getDOMNode().style.transform).toBe('rotate(-90deg)')
      expect(getPointer(mount(<Clock mode='minutes' value={15} />)).getDOMNode().style.transform).toBe('rotate(0deg)')
      expect(getPointer(mount(<Clock mode='minutes' value={30} />)).getDOMNode().style.transform).toBe('rotate(90deg)')
      expect(getPointer(mount(<Clock mode='minutes' value={45} />)).getDOMNode().style.transform).toBe('rotate(180deg)')
    })

    it('calls onChange when a different value is selected', () => {
      const onChangeCallback = jest.fn()
      const tree = mount(<Clock mode='minutes' value={12} onChange={onChangeCallback} />)
      getCircle(tree).simulate('click', testUtils.stubClickEvent(190, 230)) // click on 25
      expect(onChangeCallback).toHaveBeenCalledWith(25)

      // ensure that 0 is treated as 0 and not 60
      onChangeCallback.mockClear()
      getCircle(tree).simulate('click', testUtils.stubClickEvent(128, 30)) // click on 0
      expect(onChangeCallback).toHaveBeenCalledWith(0)
    })

    it('highlights the selected minute', () => {
      const tree55 = mount(
        <Clock mode='minutes' value={55} />
      )
      const number55 = tree55.findWhere((e) => e.type() === 'span' && e.text() === '55')
      expect(testUtils.hasClass('selected')(number55)).toBeTruthy()
      const number50 = tree55.findWhere((e) => e.type() === 'span' && e.text() === '50')
      expect(testUtils.hasClass('selected')(number50)).toBeFalsy()

      const tree0 = mount(
        <Clock mode='minutes' value={0} />
      )
      const number0 = tree0.findWhere((e) => e.type() === 'span' && e.text() === '00')
      expect(testUtils.hasClass('selected')(number0)).toBeTruthy()
    })
  })
})

function getPointer (clock) {
  return clock.findWhere((e) => e.type() === 'div' && e.getDOMNode().className.indexOf('Clock-pointer') === 0)
}

function getCircle (clock) {
  return clock.childAt(0).children('div').childAt(0)
}
