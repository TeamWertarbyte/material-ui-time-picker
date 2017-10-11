/* eslint-env jest */
import React from 'react'
import { shallow, mount, render } from 'enzyme'
import Clock from './Clock'

describe('<Clock />', () => {
  describe('24h', () => {
    it ('matches the snapshot', () => {
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
        expect(spans.findWhere((e) => e.type() === 'span' && e.text() == i).length).toBe(1)
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
  })
  
  describe('12h', () => {
    it ('matches the snapshot', () => {
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
        expect(spans.findWhere((e) => e.type() === 'span' && e.text() == i).length).toBe(1)
      }
    })
    
    it('rotates the pointer to point to the selected hour', () => {
      expect(getPointer(mount(<Clock mode='12h' value={3} />)).getDOMNode().style.transform).toBe('rotate(0deg)')
      expect(getPointer(mount(<Clock mode='12h' value={6} />)).getDOMNode().style.transform).toBe('rotate(90deg)')
      expect(getPointer(mount(<Clock mode='12h' value={9} />)).getDOMNode().style.transform).toBe('rotate(180deg)')
      expect(getPointer(mount(<Clock mode='12h' value={12} />)).getDOMNode().style.transform).toBe('rotate(270deg)')
    })
  })
  
  describe('minutes', () => {
    it ('matches the snapshot', () => {
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
        expect(spans.findWhere((e) => e.type() === 'span' && e.text() == i * 5).length).toBe(1)
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
  })
})

function getPointer (clock) {
  return clock.findWhere((e) => e.type() === 'div' && e.getDOMNode().className.indexOf('Clock-pointer') === 0)
}
