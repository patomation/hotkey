# TODO

1. [] Don't override original events and allow to pass though
2. [] Provide way to hold key down
3. [] Add key listener so user knows to what key is pressed for debugging
4. [] downarrow is arrowdown in firefox. Fix Documentation.. Is chrome the same?
5. [] Allow upper and lower case hotkey() resolution. id ArrowDown and arrowdown will both work.
6. Add react example. Where return type unsubscribed from event when component is un mounted

```js
import { useEffect } from 'react'
useEffect(() => {
  hotkey('arrowleft', () => {})
  hotkey('arrowright', () => {})
  // When component un mounts it removed the event listeners
  return () => {
    hotkey.remove('arrowleft')
    hotkey.remove('arrowright')
  }
}, [])
```
