/* eslint-env jest */

describe('index.js', () => {
  it('should export the TimePicker', () => {
    expect(require('./').default).toBe(require('./TimePicker').default)
  })
})
