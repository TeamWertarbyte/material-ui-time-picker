import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { duration, easing } from '@material-ui/core/styles/transitions'
import { getContrastRatio, fade } from '@material-ui/core/styles/colorManipulator'
import classNames from 'classnames'
import Clock from './Clock'
import { formatHours, twoDigits } from './util'

const styles = (theme) => ({
  root: {
    width: 288,
    fontFamily: theme.typography.fontFamily
  },
  header: {
    background: theme.palette.primary.main,
    color: fade(getContrastRatio(theme.palette.primary.main, theme.palette.common.black) < 7 ? theme.palette.common.white : theme.palette.common.black, 0.54),
    padding: '20px 0',
    lineHeight: '58px',
    fontSize: '58px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    userSelect: 'none'
  },
  time: {
    transition: `all ${duration.short}ms ${easing.easeInOut}`,
    cursor: 'pointer'
  },
  placeholder: {
    flex: 1
  },
  ampm: {
    display: 'flex',
    flexDirection: 'column-reverse',
    flex: 1,
    fontSize: '14px',
    lineHeight: '20px',
    marginLeft: 16,
    fontWeight: 700
  },
  select: {
    color: getContrastRatio(theme.palette.primary.main, theme.palette.common.black) < 7 ? theme.palette.common.white : theme.palette.common.black
  },
  body: {
    padding: '24px 16px',
    background: theme.palette.background.paper
  }
})

class TimePicker extends React.Component {
  constructor (props) {
    super(props)

    const defaultValue = new Date()
    defaultValue.setSeconds(0)
    defaultValue.setMilliseconds(0)
    const time = props.value || props.defaultValue || defaultValue
    this.state = {
      select: 'h',
      hours: time.getHours(),
      minutes: time.getMinutes()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value != null && (this.props.value == null || nextProps.value.getTime() !== this.props.value.getTime())) {
      this.setState({
        hours: nextProps.value.getHours(),
        minutes: nextProps.value.getMinutes()
      })
    }
  }

  handleClockChange = (value) => {
    if (this.state.select === 'h') {
      if (this.props.mode === '12h') {
        if (this.state.hours >= 12) {
          this.setState({ hours: value === 12 ? value : value + 12 }, this.propagateChange)
        } else {
          this.setState({ hours: value === 12 ? 0 : value }, this.propagateChange)
        }
      } else {
        this.setState({ hours: value }, this.propagateChange)
      }
    } else if (value % (this.props.minutesStep) === 0) {
      this.setState({ minutes: value }, this.propagateChange)
    }
  }

  handleClockChangeDone = (e) => {
    e.preventDefault() // prevent mouseUp after touchEnd

    if (this.state.select === 'm') {
      if (this.props.onMinutesSelected) {
        setTimeout(() => {
          this.props.onMinutesSelected()
        }, 300)
      }
    } else {
      setTimeout(() => {
        this.setState({ select: 'm' })
      }, 300)
    }
  }

  editHours = () => this.setState({ select: 'h' })

  editMinutes = () => this.setState({ select: 'm' })

  setAm = () => {
    if (this.state.hours >= 12) {
      this.setState({ hours: this.state.hours - 12 }, this.propagateChange)
    }
  }

  setPm = () => {
    if (this.state.hours < 12) {
      this.setState({ hours: this.state.hours + 12 }, this.propagateChange)
    }
  }

  propagateChange = () => {
    if (this.props.onChange != null) {
      const date = new Date()
      date.setHours(this.state.hours)
      date.setMinutes(this.state.minutes)
      date.setSeconds(0)
      date.setMilliseconds(0)
      this.props.onChange(date)
    }
  }

  render () {
    const {
      classes,
      mode
    } = this.props

    const clockMode = this.state.select === 'm' ? 'minutes' : mode
    const { minutes } = this.state
    const { hours, isPm } = formatHours(this.state.hours, mode)

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <div className={classes.placeholder} />
          <div>
            <span
              className={classNames(classes.time, { [classes.select]: this.state.select === 'h' && 'active' })}
              onClick={this.editHours}
            >
              {twoDigits(hours)}
            </span>
            :
            <span
              className={classNames(classes.time, { [classes.select]: this.state.select === 'm' && 'active' })}
              onClick={this.editMinutes}
            >
              {twoDigits(minutes)}
            </span>
          </div>
          {mode === '12h' ? (
            <div className={classes.ampm}>
              <span
                className={classNames(classes.time, { [classes.select]: isPm })}
                onClick={this.setPm}
              >
                PM
              </span>
              <span
                className={classNames(classes.time, { [classes.select]: !isPm })}
                onClick={this.setAm}
              >
                AM
              </span>
            </div>
          ) : (<div className={classes.placeholder} />)}
        </div>
        <div className={classes.body}>
          <Clock
            mode={clockMode}
            onChange={this.handleClockChange}
            value={clockMode === 'minutes' ? minutes : hours}
            onMouseUp={this.handleClockChangeDone}
            onTouchEnd={this.handleClockChangeDone}
            minutesStep={this.props.minutesStep}
          />
        </div>
      </div>
    )
  }
}

TimePicker.propTypes = {
  /** The initial value of the time picker. */
  defaultValue: PropTypes.instanceOf(Date),
  /** Steps between minutes. */
  minutesStep: PropTypes.number,
  /** Sets the clock mode, 12-hour or 24-hour clocks are supported. */
  mode: PropTypes.oneOf(['12h', '24h']),
  /** Callback that is called with the new date (as Date instance) when the value is changed. */
  onChange: PropTypes.func,
  /** Callback that is called when the minutes are changed. Can be used to automatically hide the picker after selecting a time. */
  onMinutesSelected: PropTypes.func,
  /** The value of the time picker, for use in controlled mode. */
  value: PropTypes.instanceOf(Date)
}

TimePicker.defaultProps = {
  mode: '12h',
  minutesStep: 1
}

export default withStyles(styles)(TimePicker)
