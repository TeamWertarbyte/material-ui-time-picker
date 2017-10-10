import React from 'react'
import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
import Clock from '../src/Clock'

storiesOf('Clock', module)
  .add('12 hours', () => (
    <Clock mode='12h' />
  ))
  .add('24 hours', () => (
    <Clock mode='24h' />
  ))
  .add('minutes', () => (
    <Clock mode='minutes' />
  ))
