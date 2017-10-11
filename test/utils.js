export function stubClickEvent (x, y) {
  return {
    clientX: x,
    clientY: y,
    target: {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      })
    }
  }
}

export function stubTouchMoveEvent (x, y) {
  return {
    touches: [{
      clientX: x,
      clientY: y
    }],
    target: {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      })
    }
  }
}

export function stubMouseMoveEvent (x, y, buttons) {
  return {
    clientX: x,
    clientY: y,
    buttons,
    target: {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      })
    }
  }
}
