import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Clock from '../src/Clock'
import TimePicker from '../src/TimePicker'
import TimeInput from '../src/TimeInput'

storiesOf('Clock', module)
  .add('12 hours', () => (
    <Clock mode='12h' value={7} onChange={action('onChange')} />
  ))
  .add('24 hours', () => (
    <div>
      <Clock mode='24h' value={3} onChange={action('onChange')} />
      <Clock mode='24h' value={15} onChange={action('onChange')} />
    </div>
  ))
  .add('minutes', () => (
    <div>
      <Clock mode='minutes' value={35} onChange={action('onChange')} />
      <Clock mode='minutes' value={42} onChange={action('onChange')} />
    </div>
  ))

storiesOf('TimePicker', module)
  .add('12 hours', () => (
    <TimePicker mode='12h' onChange={action('onChange')} />
  ))
  .add('24 hours', () => (
    <TimePicker mode='24h' onChange={action('onChange')} />
  ))

storiesOf('TimeInput', module)
  .add('12 hours', () => (
    <TimeInput mode='12h' onChange={action('onChange')} />
  ))
  .add('24 hours', () => (
    <TimeInput mode='24h' onChange={action('onChange')} />
  ))
  .add('complex example', () => (
    <FormControl disabled>
      <InputLabel htmlFor='time-helper'>Start time</InputLabel>
      <TimeInput id='time-helper' onChange={action('onChange')} />
      <FormHelperText>Some important helper text</FormHelperText>
    </FormControl>
  ))
  .add('german', () => (
    <TimeInput mode='24h' onChange={action('onChange')} cancelLabel='Abbrechen' okLabel='Ok' />
  ))
  .add('default input value and initial time', () => (
    <TimeInput mode='12h' defaultValue='--:--' initialTime={new Date(2018, 8, 4, 12, 0, 0, 0, 0)} />
  ))
