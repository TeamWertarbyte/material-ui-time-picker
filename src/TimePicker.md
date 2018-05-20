```jsx
const { Button, Dialog, DialogActions } = require('@material-ui/core');
initialState = { open: false };

<div>
  <Button
    onClick={() => setState({ open: true })}
  >
    Open time picker
  </Button>
  <Dialog
    maxWidth='xs'
    open={state.open}
  >
    <TimePicker mode='24h' />
    <DialogActions>
      <Button onClick={() => setState({ open: false })} color='primary'>
        Cancel
      </Button>
      <Button onClick={() => setState({ open: false })} color='primary'>
        Ok
      </Button>
    </DialogActions>
  </Dialog>
</div>
```
