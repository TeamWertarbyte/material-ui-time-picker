/* eslint-env jest */
import { twoDigits, formatHours, getShortestAngle } from './util'

describe('twoDigits', () => {
  it('adds a leading zero to one-digit numbers', () => {
    expect(twoDigits(3)).toBe('03')
  })

  it('does not change two-digit numbers', () => {
    expect(twoDigits(42)).toBe('42')
  })
})

describe('formatHours', () => {
  it('tells whether the hours are am or pm', () => {
    expect(formatHours(0, '24h').isPm).toBe(false)
    expect(formatHours(1, '24h').isPm).toBe(false)
    expect(formatHours(12, '24h').isPm).toBe(true)
    expect(formatHours(13, '24h').isPm).toBe(true)
  })

  it('returns 12 hour hours in 12h mode', () => {
    expect(formatHours(1, '12h').hours).toBe(1)
    expect(formatHours(13, '12h').hours).toBe(1)
    expect(formatHours(12, '12h').hours).toBe(12)
    expect(formatHours(0, '12h').hours).toBe(12)
  })

  it('returns 24 hour hours in 24h mode', () => {
    expect(formatHours(1, '24h').hours).toBe(1)
    expect(formatHours(13, '24h').hours).toBe(13)
    expect(formatHours(12, '24h').hours).toBe(12)
    expect(formatHours(0, '24h').hours).toBe(0)
  })
})

describe('getShortestAngle', () => {
  it('calculates the angle with the shortest distance from a specific angle to another angle (modulo 360)', () => {
    expect(getShortestAngle(0, 90)).toBe(90)
    expect(getShortestAngle(20, 90)).toBe(90)
    expect(getShortestAngle(210, 240)).toBe(240)
    expect(getShortestAngle(-60, 240)).toBe(-120)
    expect(getShortestAngle(-60, 150)).toBe(-210)
    expect(getShortestAngle(42, 42)).toBe(42)
  })
})
