import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import { withStyles } from '@material-ui/core/styles'
import TimePicker from './TimePicker'
import { formatHours, twoDigits } from './util'

const styles = {
  header: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2
  },
  body: {
    paddingBottom: 20
  }
}

class TimeInput extends React.Component {
  constructor (props) {
    super(props)
    const defaultValue = new Date()
    defaultValue.setSeconds(0)
    defaultValue.setMilliseconds(0)
    const initValue = props.value || props.defaultValue || defaultValue
    this.state = { open: false, initValue, value: initValue }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value })
    }
  }

  showDialog = () => this.setState({ open: true })

  handleChange = (value) => {
    if (this.props.onChange != null) {
      this.props.onChange(value)
    }
    this.setState({ value })
  }

  handleOk = () => {
    this.setState({ open: false, initValue: this.state.value })
  }

  handleCancel = () => {
    if (this.props.onChange != null) {
      this.props.onChange(this.state.initValue)
    }
    this.setState({ open: false, value: this.state.initValue })
  }

  render () {
    const {
      autoOk,
      cancelLabel,
      classes,
      defaultValue, // eslint-disable-line
      disabled: disabledProp,
      mode,
      okLabel,
      onChange, // eslint-disable-line
      value: valueProp, // eslint-disable-line
      minutesStep,
      cancelOnClose,
      ...other
    } = this.props

    const { value } = this.state

    const { hours, isPm } = formatHours(value.getHours(), mode)
    const formattedValue = mode === '12h'
      ? `${hours}:${twoDigits(value.getMinutes())} ${isPm ? 'pm' : 'am'}`
      : `${twoDigits(value.getHours())}:${twoDigits(value.getMinutes())}`

    const { muiFormControl } = this.context
    const disabled = disabledProp || (muiFormControl != null && muiFormControl.disabled)

    return [
      <Input
        {...other}
        disabled={disabled}
        onClick={!disabled ? this.showDialog : null}
        value={formattedValue}
        readOnly
        key='TimeInput-input'
      />,
      <Dialog
        maxWidth='xs'
        open={this.state.open}
        key='TimeInput-dialog'
        onClose={cancelOnClose ? this.handleCancel : this.handleOk}
      >
        <TimePicker
          mode={mode}
          value={value}
          onChange={this.handleChange}
          onMinutesSelected={autoOk ? this.handleOk : null}
          classes={{ header: classes.header, body: classes.body }}
          minutesStep={minutesStep || 1}
        />
        <DialogActions>
          <Button onClick={this.handleCancel} color='primary'>{cancelLabel}</Button>
          <Button onClick={this.handleOk} color='primary'>{okLabel}</Button>
        </DialogActions>
      </Dialog>
    ]
  }
}

TimeInput.propTypes = {
  /** If true, automatically accept and close the picker on set minutes. */
  autoOk: PropTypes.bool,
  /** Override the label of the cancel button. */
  cancelLabel: PropTypes.string,
  /** The initial value of the time picker. */
  defaultValue: PropTypes.instanceOf(Date),
  /** Sets the clock mode, 12-hour or 24-hour clocks are supported. */
  mode: PropTypes.oneOf(['12h', '24h']),
  /** Override the label of the ok button. */
  okLabel: PropTypes.string,
  /** Callback that is called with the new date (as Date instance) when the value is changed. */
  onChange: PropTypes.func,
  /** The value of the time picker, for use in controlled mode. */
  value: PropTypes.instanceOf(Date),
  /** Steps between minutes. */
  minutesStep: PropTypes.number,
  /** Returns init date when dialog is closed (clicking background). */
  cancelOnClose: PropTypes.bool
}

TimeInput.defaultProps = {
  autoOk: false,
  cancelLabel: 'Cancel',
  mode: '12h',
  okLabel: 'Ok',
  minutesStep: 1,
  cancelOnClose: true
}

TimeInput.contextTypes = {
  muiFormControl: PropTypes.object
}

export default withStyles(styles)(TimeInput)
