# material-ui-time-picker
[![npm Package](https://img.shields.io/npm/v/material-ui-time-picker.svg)](https://www.npmjs.com/package/material-ui-time-picker)
[![Build Status](https://travis-ci.org/TeamWertarbyte/material-ui-time-picker.svg?branch=master)](https://travis-ci.org/TeamWertarbyte/material-ui-time-picker)
[![Coverage Status](https://coveralls.io/repos/github/TeamWertarbyte/material-ui-time-picker/badge.svg?branch=master)](https://coveralls.io/github/TeamWertarbyte/material-ui-time-picker?branch=master)

This project provides a [time picker][time-picker-spec] for [Material-UI][material-ui].

![Demo](demo.gif)

## Installation
```
npm i --save material-ui-time-picker
```

## Usage
There are multiple ways to use this component to allow greater flexibility. This is the most basic usage that behaves similar to the [Material-UI 0.x time picker][legacy-time-picker]:

```jsx
import TimeInput from 'material-ui-time-picker'

// uncontrolled input
<TimeInput
  mode='12h'
  onChange={(time) => this.handleChange(time)}
/>

// controlled input
<TimeInput
  mode='12h'
  value={this.state.time}
  onChange={(time) => this.handleChange(time)}
/>
```

For detailed documentation, take a look into the [styleguide][]. The source code, especially the tests, might also be helpful.

## TimeInput Properties
|Name|Type|Default|Description|
|---|---|---|---|
|autoOk|`bool`|`false`|If true, automatically accept and close the picker on set minutes.|
|cancelLabel|`string`|`'Cancel'`|Override the label of the cancel button.|
|defaultValue|`Date`||The initial value of the time picker.|
|mode|`enum: '12h' '24h'`|`'12h'`|Sets the clock mode, 12-hour or 24-hour clocks are supported.|
|okLabel|`string`|`'Ok'`|Override the label of the ok button.|
|onChange|`func`||Callback that is called with the new date (as Date instance) when the value is changed.|
|value|`Date`||The value of the time picker, for use in controlled mode.|

Note: `TimeInput` behaves like Material-UI's `Input` component and can be used inside `FormControl`s.

## License
The files included in this repository are licensed under the MIT license.

[time-picker-spec]: https://material.io/guidelines/components/pickers.html#pickers-time-pickers
[material-ui]: https://material-ui-next.com/
[legacy-time-picker]: http://www.material-ui.com/#/components/time-picker
[styleguide]: https://teamwertarbyte.github.io/material-ui-time-picker
