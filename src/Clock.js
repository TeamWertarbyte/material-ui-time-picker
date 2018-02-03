import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { getContrastRatio } from 'material-ui/styles/colorManipulator'
import { duration, easing } from 'material-ui/styles/transitions'
import classNames from 'classnames'
import { getShortestAngle } from './util'

const styles = (theme) => ({
  root: {
    width: 256,
    height: 256,
    fontFamily: theme.typography.fontFamily,
    cursor: 'default'
  },
  circle: {
    width: 256,
    height: 256,
    borderRadius: '50%',
    background: theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[900],
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
    userSelect: 'none',
    '&.selected': {
      color: getContrastRatio(theme.palette.primary.main, theme.palette.common.fullBlack) < 7 ? theme.palette.common.fullWhite : theme.palette.common.fullBlack
    }
  },
  smallNumber: {
    fontSize: '12px',
    color: theme.palette.text.secondary
  },
  pointer: {
    width: 'calc(50% - 20px)',
    height: 2,
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    left: '50%',
    top: 'calc(50% - 1px)',
    transformOrigin: 'left center',
    pointerEvents: 'none'
  },
  animatedPointer: {
    transition: `all ${duration.short}ms ${easing.easeInOut}`
  },
  smallPointer: {
    width: 'calc(50% - 52px)'
  },
  innerDot: {
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    top: -4 + 1,
    left: -4,
    width: 8,
    height: 8,
    borderRadius: '50%'
  },
  outerDot: {
    border: `16px solid ${theme.palette.primary.main}`,
    borderWidth: 16,
    position: 'absolute',
    top: -16 + 1,
    right: -16,
    width: 0,
    height: 0,
    borderRadius: '50%',
    boxSizing: 'content-box'
  },
  outerDotOdd: {
    background: getContrastRatio(theme.palette.primary.main, theme.palette.common.fullBlack) < 7 ? theme.palette.common.fullWhite : theme.palette.common.fullBlack,
    width: 4,
    height: 4,
    borderWidth: 14
  }
})

const size = 256

class Clock extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { touching: false, angle: getPointerAngle(props.value, props.mode) }
  }

  componentWillReceiveProps ({ value, mode }) {
    if (mode !== this.props.mode || value !== this.props.value) {
      this.setState({ angle: getShortestAngle(this.state.angle, getPointerAngle(value, mode)) })
    }
  }

  disableAnimatedPointer = () => this.setState({ touching: true })
  enableAnimatedPointer = () => this.setState({ touching: false })

  handleTouchMove = (e) => {
    const rect = e.target.getBoundingClientRect()
    this.movePointer(e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top)
  }

  handleTouchEnd = (e) => {
    this.handleTouchMove(e)
    this.enableAnimatedPointer()
  }

  handleMouseMove = (e) => {
    // MouseEvent.which is deprecated, but MouseEvent.buttons is not supported in Safari
    if (e.buttons === 1 || e.which === 1) {
      const rect = e.target.getBoundingClientRect()
      this.movePointer(e.clientX - rect.left, e.clientY - rect.top)
    }
  }

  handleClick = (e) => {
    const rect = e.target.getBoundingClientRect()
    this.movePointer(e.clientX - rect.left, e.clientY - rect.top)
  }

  movePointer (x, y) {
    const value = getPointerValue(x, y, this.props.mode)
    if (value !== this.props.value && this.props.onChange != null) {
      this.props.onChange(value)
    }
  }

  render () {
    const { classes, mode, value, ...other } = this.props
    const { touching } = this.state

    return (
      <div className={classes.root} {...other}>
        <div
          className={classes.circle}
          onTouchMove={this.handleTouchMove}
          onMouseMove={this.handleMouseMove}
          onTouchStart={this.disableAnimatedPointer}
          onMouseDown={this.disableAnimatedPointer}
          onTouchEnd={this.handleTouchEnd}
          onMouseUp={this.enableAnimatedPointer}
          onClick={this.handleClick}
        >
          <div className={classNames(classes.pointer, { [classes.smallPointer]: mode === '24h' && (value === 0 || value > 12), [classes.animatedPointer]: !touching })} style={{
            transform: `rotate(${this.state.angle}deg)`
          }}>
            <div className={classes.innerDot} />
            <div className={classNames(classes.outerDot, { [classes.outerDotOdd]: mode === 'minutes' && value % 5 !== 0 })} />
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
              className={classNames(classes.number, classes.smallNumber, { selected: value === digit.display || (digit.display === 24 && value === 0) })}
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
              className={classNames(classes.number, { selected: value === digit.display || (digit.display === 60 && value === 0) })}
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
  /** Sets the mode of this clock. It can either select hours (supports 12- and 24-hour-clock) or minutes. */
  mode: PropTypes.oneOf(['12h', '24h', 'minutes']).isRequired,
  /** Callback that is called with the new hours/minutes (as a number) when the value is changed. */
  onChange: PropTypes.func,
  /** The value of the clock. */
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
      const radius = Math.sqrt(Math.pow(size / 2 - x, 2) + Math.pow(size / 2 - y, 2))
      let value = 12 - Math.round(angle * 12 / 360)
      if (value === 0) {
        value = 12
      }
      if (radius < size / 2 - 32) {
        value = value === 12 ? 0 : value + 12
      }
      return value
    }
    case 'minutes': {
      const value = Math.round(60 - 60 * angle / 360)
      return value === 60 ? 0 : value
    }
  }
}
