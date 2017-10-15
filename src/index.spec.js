/* eslint-env jest */

describe('index.js', () => {
  it('should export the TimeInput as default export', () => {
    expect(require('./').default).toBe(require('./TimeInput').default)
  })

  it('should export the TimeInput', () => {
    expect(require('./').TimeInput).toBe(require('./TimeInput').default)
  })

  it('should export the TimePicker', () => {
    expect(require('./').TimePicker).toBe(require('./TimePicker').default)
  })

  it('should export the Clock', () => {
    expect(require('./').Clock).toBe(require('./Clock').default)
  })
})
