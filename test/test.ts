import { expect } from 'chai'
import hotkey, { storage, Hotkey, getCommandString, formatCommandString, bindEvents } from '../src/index'
// Emulate global dom
import 'jsdom-global/register'

type SimulateKeyboardEvent = (
  kind: 'keydown' | 'keyup',
  key: string,
  options?: {
    shiftKey?: boolean | undefined
    altKey?: boolean | undefined
    ctrlKey?: boolean | undefined
  }
) => void

const simulateKeyboardEvent: SimulateKeyboardEvent = (
  kind, key, options = {}
) => {
  const {
    shiftKey = false,
    altKey = false,
    ctrlKey = false
  } = options

  const keyboardEevent = new KeyboardEvent(
    kind,
    {
      bubbles: true,
      cancelable: true,
      key,
      shiftKey,
      altKey,
      ctrlKey
    }
  )
  document.dispatchEvent(keyboardEevent)
}

describe('Hotkey class', (): void => {
  it('can be created with new without error', (): void => {
    const hotkeyClass = new Hotkey()
    expect(hotkeyClass instanceof Hotkey).to.equal(true)
  })
})

describe('getCommandString function', (): void => {
  it('it returns empty string if commands are not defined', (): void => {
    const commandString = getCommandString({})
    expect(commandString).to.equal('')
  })
})

describe('bindEvents function', (): void => {
  it('it exicutes without breaking', (): void => {
    bindEvents()
  })
})

interface TestCase {
  key: string
  command: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
}

const testCases: TestCase[] = [
  { key: 'a', command: 'a' },
  { key: 'b', command: 'ctrl+b', ctrlKey: true },
  { key: 'c', command: 'control+c', ctrlKey: true },
  { key: 'd', command: 'alt+d', altKey: true },
  { key: 'e', command: 'shift+e', shiftKey: true },
  { key: ' ', command: 'space' } // spacebar
  // TODO tab
  // TODO enter?
  // Special characters?
  // Arrows
  // Combos?
]

testCases.forEach(({
  key, command,
  ctrlKey = false,
  altKey = false,
  shiftKey = false
}) => {
  describe(command, (): void => {
    let downCalled = false
    let upCalled = false
    hotkey(command)
      .down(() => {
        downCalled = true
      }).up(() => {
        upCalled = true
      })
    it('exists in storage', (): void => {
      expect(storage[formatCommandString(command)] instanceof Hotkey).to.equal(true)
    })
    it('down callback', (): void => {
      simulateKeyboardEvent('keydown', key, { ctrlKey, altKey, shiftKey })
      expect(downCalled).to.equal(true)
    })
    it('up callback', (): void => {
      simulateKeyboardEvent('keyup', key, { ctrlKey, altKey, shiftKey })
      expect(upCalled).to.equal(true)
    })
    it('removes from storage', (): void => {
      hotkey.remove(command)
      expect(storage[formatCommandString(command)]).to.equal(undefined)
    })
  })
})

describe('edge cases', (): void => {
  it('on down callback can be set as second argument', (): void => {
    hotkey('p', () => { /* */ })
      .down(() => { /* */ })
    simulateKeyboardEvent('keydown', 'p')
    simulateKeyboardEvent('keyup', 'p')
  })
  it('on down callback can be set as second argument without down', (): void => {
    hotkey('q', () => { /* */ })
    simulateKeyboardEvent('keydown', 'q')
    simulateKeyboardEvent('keyup', 'q')
  })
  it('desnt break when key assigned but callback undefined', (): void => {
    hotkey('u')
    simulateKeyboardEvent('keydown', 'u')
    simulateKeyboardEvent('keyup', 'u')
  })
  it('doesnt break when no hotkey is assigned', (): void => {
    simulateKeyboardEvent('keydown', 'o')
    simulateKeyboardEvent('keyup', 'o')
  })
  it('wont overwrite asignment', (): void => {
    hotkey('i', () => { /* */ })
    hotkey('i', () => { /* */ })
  })
  it('wont break when callbacks are undefined', (): void => {
    hotkey('t').up(undefined).down(undefined)
  })
  it('doesnt break when removing a hotkey that doesnt exist', (): void => {
    hotkey.remove('0')
  })
})
