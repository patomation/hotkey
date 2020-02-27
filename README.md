Hotkey
==========

A small module that handles your hotkeys

## Installation

  `npm install @patomation/hotkey`

## Usage

Supports using modifier keys in any order:
`alt+ctrl+shift+p` for example, is the same as `p+control+alt+shift`:

```javascript
hotkey('control+z', () => {
    //Do some undo action
});
```

Supports alpha numeric characters and more
```javascript
hotkey('enter', () => {
    //Do something when user hits enter
});
```

Add hotkey functions for arrow keys by using `uparrow`, `downarrow`, `leftarrow` and `rightarrow`
```javascript
hotkey('downarrow', () => {
    //Down arrow function
});
```

### new features
To have events for key up and key down. This is now supported.

```javascript
hotkey('f')
.down(() => {
  //Do something when f key is down
})
.up(() => {
  //Do something when f key is up
})
```

Note: Adding up and down methods supports modifiers in hotkey commands.
Additionally this could be written this way:
```javascript
hotkey('shift+f', () => {
  //Do something when f key is down
}).up(() => {
  //Do something when f key is up
})
```

# Development

  1. clone repo
  2. Install dependencies
  `npm install`
  2. eslint:
  `npm run lint`
  3. build lib folder with rollup with typescript overides
  `npm run prebuild`

## Tests

  `npm test`

## Contributing

If you have any updates fork the repo and make a pull request.
