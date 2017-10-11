import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { getContrastRatio } from 'material-ui/styles/colorManipulator'
import classNames from 'classnames'

const styles = (theme) => ({
  root: {
    width: 256,
    height: 256
  },
  circle: {
    width: 256,
    height: 256,
    borderRadius: '50%',
    background: theme.palette.background.contentFrame,
    color: theme.palette.text.primary,
    position: 'relative'
  },
  number: {
    width: 32,
    height: 32,
    left: 'calc(50% - 16px)',
    top: 'calc(50% - 16px)',
    position: 'absolute',
    textAlign: 'center',
    lineHeight: '32px',
    cursor: 'pointer',
    fontSize: '14px',
    pointerEvents: 'none',
    ['&.selected']: {
      color: getContrastRatio(theme.palette.primary[500], theme.palette.common.fullBlack) < 7 ? theme.palette.common.fullWhite : theme.palette.common.fullBlack
    }
  },
  smallNumber: {
    fontSize: '12px',
    color: theme.palette.text.secondary
  },
  pointer: {
    width: 'calc(50% - 20px)',
    height: 2,
    backgroundColor: theme.palette.primary[500],
    position: 'absolute',
    left: '50%',
    top: 'calc(50% - 1px)',
    transformOrigin: 'left center',
    pointerEvents: 'none'
  },
  innerDot: {
    backgroundColor: theme.palette.primary[500],
    position: 'absolute',
    top: -4 + 1,
    left: -4,
    width: 8,
    height: 8,
    borderRadius: '50%'
  },
  outerDot: {
    border: `16px solid ${theme.palette.primary[500]}`,
    borderWidth: 16,
    position: 'absolute',
    top: -16 + 1,
    right: -16,
    width: 0,
    height: 0,
    borderRadius: '50%'
  },
  outerDotOdd: {
    background: getContrastRatio(theme.palette.primary[500], theme.palette.common.fullBlack) < 7 ? theme.palette.common.fullWhite : theme.palette.common.fullBlack,
    width: 4,
    height: 4,
    borderWidth: 14
  }
})

const size = 256

class Clock extends React.Component {
  handleTouchMove (e) {
    this.movePointer(e.touches[0].clientX, e.touches[0].clientY)
  }

  handleMouseMove (e) {
    if (e.buttons === 1) { // TODO magic constant (left mouse button)
      this.movePointer(e.clientX, e.clientY)
    }
  }

  handleClick (e) {
    this.movePointer(e.clientX, e.clientY)
  }

  movePointer (x, y) { 
    const value = getPointerValue(x, y, this.props.mode)
    if (value !== this.props.value) {
      this.props.onChange(value)
    }
  }

  render () {
    const { classes, mode, value } = this.props
    const pointerAngle = getPointerAngle(value, mode)
    const isOdd = mode === 'minutes' && value % 5 !== 0

    return (
      <div className={classes.root}>
        <div
          className={classes.circle}
          onTouchMove={(e) => this.handleTouchMove(e)}
          onMouseMove={(e) => this.handleMouseMove(e)}
          onClick={(e) => this.handleClick(e)}
        >
          <div className={classes.pointer} style={{
            transform: `rotate(${pointerAngle}deg)`,
            width: mode === '24h' && value > 12 ? 'calc(50% - 52px)' : null
          }}>
            <div className={classes.innerDot} />
            <div className={classNames(classes.outerDot, { [classes.outerDotOdd]: isOdd })} />
          </div>
          {mode === '12h' && getNumbers(12, { size }).map((digit, i) => (
            <span
              key={digit.display}
              className={classNames(classes.number, { selected: value === digit.display })}
              style={{
                transform: `translate(${digit.translateX}px, ${digit.translateY}px)`
              }}
            >
              {digit.display}
            </span>
          ))}
          {mode === '24h' && getNumbers(12, { size }).map((digit, i) => (
            <span
              key={digit.display}
              className={classNames(classes.number, { selected: value === digit.display })}
              style={{
                transform: `translate(${digit.translateX}px, ${digit.translateY}px)`
              }}
            >
              {digit.display}
            </span>
          ))}
          {mode === '24h' && getNumbers(12, { size: size - 64, start: 13 }).map((digit, i) => (
            <span
              key={digit.display}
              className={classNames(classes.number, classes.smallNumber, { selected: value === digit.display || digit.display === 24 && value === 0 })}
              style={{
                transform: `translate(${digit.translateX}px, ${digit.translateY}px)`
              }}
            >
              {digit.display === 24 ? '00' : digit.display}
            </span>
          ))}
          {mode === 'minutes' && getNumbers(12, { size, start: 5, step: 5 }).map((digit, i) => (
            <span
              key={digit.display}
              className={classNames(classes.number, { selected: value === digit.display })}
              style={{
                transform: `translate(${digit.translateX}px, ${digit.translateY}px)`
              }}
            >
              {digit.display === 60 ? '00' : digit.display}
            </span>
          ))}
        </div>
      </div>
    )
  }
}

Clock.propTypes = {
  mode: PropTypes.oneOf(['12h', '24h', 'minutes']).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired
}

export default withStyles(styles)(Clock)

function getNumbers (count, { size, start = 1, step = 1 }) {
  return Array.apply(null, Array(count)).map((_, i) => ({
    display: i * step + start,
    translateX: (size / 2 - 20) * Math.cos(2 * Math.PI * (i - 2) / count),
    translateY: (size / 2 - 20) * Math.sin(2 * Math.PI * (i - 2) / count)
  }))
}

function getPointerAngle (value, mode) {
  switch (mode) {
    case '12h':
      return 360 / 12 * (value - 3)
    case '24h':
      return 360 / 12 * (value % 12 - 3)
    case 'minutes':
      return 360 / 60 * (value - 15)
  }
}

function getPointerValue (x, y, mode) {
  let angle = Math.atan2(size / 2 - x, size / 2 - y) / Math.PI * 180
  if (angle < 0) {
    angle = 360 + angle
  }

  switch (mode) {
    case '12h': {
      const value = 12 - Math.round(angle * 12 / 360)
      return value === 0 ? 12 : value
    }
    case '24h': {
      const radius = Math.sqrt()
      const value = 12 - Math.round(angle * 12 / 360)
      // TODO get distance to center to calculate the radius
      return value === 0 ? 12 : value
    }
      // TODO
      // return 360 / 12 * (value % 12 - 3)
    case 'minutes':
      // TODO
      // return 360 / 60 * (value - 15)
  }
}
