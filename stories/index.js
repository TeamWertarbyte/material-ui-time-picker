import React from 'react'
import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
import Clock from '../src/Clock'

storiesOf('Clock', module)
  .add('12 hours', () => (
    <Clock mode='12h' value={7} />
  ))
  .add('24 hours', () => (
    <div>
      <Clock mode='24h' value={3} />
      <Clock mode='24h' value={15} />
    </div>
  ))
  .add('minutes', () => (
    <div>
      <Clock mode='minutes' value={35} />
      <Clock mode='minutes' value={42} />
    </div>
  ))
