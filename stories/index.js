import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Clock from '../src/Clock'

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
