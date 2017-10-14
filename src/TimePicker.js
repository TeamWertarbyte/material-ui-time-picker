import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Clock from './Clock'

const styles = {

}

class TimePicker extends React.Component {
  constructor (props) {
    super(props)

    const time = props.value || new Date()
    this.state = {
      select: 'h',
      hours: time.getHours(),
      minutes: time.getMinutes()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value != null && nextProps.value.getTime() !== this.props.value.getTime()) {
      this.setState({
        hours: nextProps.value.getHours(),
        minutes: nextProps.value.getMinutes()
      })
    }
  }

  handleClockChange = (value) => {
    if (this.state.select === 'h') {
      this.setState({ hours: value })
    } else {
      this.setState({ minutes: value })
    }
  }

  handleClockChangeDone = (e) => {
    e.preventDefault() // prevent mouseUp after touchEnd

    setImmediate(() => {
      if (this.state.select === 'h') {
        this.setState({ select: 'm' })
      } else if (this.props.onChange != null) {
        const date = new Date()
        date.setHours(this.state.hours)
        date.setMinutes(this.state.minutes)
        date.setSeconds(0)
        date.setMilliseconds(0)
        this.props.onChange(date)
      }
    })
  }

  render () {
    const {
      mode
    } = this.props

    const clockMode = this.state.select === 'm' ? 'minutes' : mode
    const { hours, isPm } = convert12HourClock(this.state.hours, mode)

    return (
      <div>
        <Clock
          mode={clockMode}
          onChange={this.handleClockChange}
          value={clockMode === 'minutes' ? this.state.minutes : hours}
          onMouseUp={this.handleClockChangeDone}
          onTouchEnd={this.handleClockChangeDone}
        />
      </div>
    )
  }
}

TimePicker.propTypes = {
  mode: PropTypes.oneOf(['12h', '24h']).isRequired,
  onChange: PropTypes.func,
  value: PropTypes.instanceOf(Date)
}

export default withStyles(styles)(TimePicker)

function convert12HourClock (hours, mode) {
  const isPm = hours >= 12
  if (mode === '24h') {
    return { hours, isPm }
  } else if (hours === 0) {
    return { hours: 12, isPm }
  } else if (hours < 12) {
    return { hours, isPm }
  } else {
    return { hours: hours - 12, isPm }
  }
}
