import React from 'react'
import PropTypes from 'prop-types'
import { withStyles,  } from 'material-ui/styles'

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
    fontSize: '14px'
  },
  smallNumber: {
    width: 32,
    height: 32,
    left: 'calc(50% - 16px)',
    top: 'calc(50% - 16px)',
    position: 'absolute',
    textAlign: 'center',
    lineHeight: '32px',
    cursor: 'pointer',
    fontSize: '12px',
    color: theme.palette.text.secondary
  }
})

class Clock extends React.Component {
  render () {
    const { classes, mode } = this.props
    const size = 256

    return (
      <div className={classes.root}>
        <div className={classes.circle}>
          {mode === '12h' && getNumbers(12, { size }).map((digit, i) => (
            <span
              key={digit.display}
              className={classes.number}
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
              className={classes.number}
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
              className={classes.smallNumber}
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
              className={classes.number}
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
  mode: PropTypes.oneOf(['12h', '24h', 'minutes'])
}

export default withStyles(styles)(Clock)

function getNumbers (count, { size, start = 1, step = 1 }) {
  return Array.apply(null, Array(count)).map((_, i) => ({
    display: i * step + start,
    translateX: (size / 2 - 20) * Math.cos(2 * Math.PI * (i - 2) / count),
    translateY: (size / 2 - 20) * Math.sin(2 * Math.PI * (i - 2) / count)
  }))
}
