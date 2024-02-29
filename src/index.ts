type HotkeyStorage = Record<string, HotkeyInstance>

export const storage: HotkeyStorage = {}

type Callback = () => void

/**
 * hotkey class instance
 * @param alternateUp callback
 */
export class HotkeyInstance {
  constructor(alternateUp?: Callback | null) {
    this.up =
      alternateUp !== undefined && alternateUp !== undefined
        ? alternateUp
        : null // Function
    this.down = null // Function
    this.pressed = false // Boolean - only let us press once
  }

  up: null | Callback
  down: null | Callback
  pressed: boolean
}

type CommandString = string

type LastKey = CommandString | null

type Up = (arg0?: Callback) => {
  down: Down
}

type Down = (arg0?: Callback) => {
  up: Up
}

type Remove = (command: CommandString) => void

interface Commands {
  altKey?: boolean
  ctrlKey?: boolean
  shiftKey?: boolean
  key?: string
}
export interface HotkeyAssignmentFunction {
  (command: CommandString, callback?: Callback): { up: Up; down: Down }
  remove: Remove
}
export const getCommandString = ({
  altKey,
  ctrlKey,
  shiftKey,
  key,
}: Commands | KeyboardEvent): CommandString => {
  let value = ''
  const characterMap: Record<string, string> = {
    '~': '`',
    '!': '1',
    '@': '2',
    '#': '3',
    $: '4',
    '%': '5',
    '^': '6',
    '&': '7',
    '*': '8',
    '(': '9',
    ')': '0',
    _: '-',
    '+': '=',
    '{': '[',
    '}': ']',
    '|': '\\',
    ':': ';',
    '<': ',',
    '>': '.',
    '?': '/',
  }
  if (key !== undefined) {
    const keyInCharacterMap = characterMap[key]
    if (keyInCharacterMap !== undefined) {
      key = keyInCharacterMap
    }
  }
  if (altKey !== undefined && altKey && key !== 'alt') {
    value += 'alt+'
  }
  if (ctrlKey !== undefined && ctrlKey && key !== 'control') {
    value += 'ctrl+'
  }
  if (shiftKey !== undefined && shiftKey && key !== 'shift') {
    value += 'shift+'
  }
  if (key !== undefined) key = key?.toLowerCase() // Force lowercase
  // Handle space and regular keysg
  if (key !== undefined) {
    value += key === ' ' ? 'space' : key
  }

  return value
}

export const formatCommandString = (command: CommandString): CommandString => {
  // Collect Modifiers
  const commands: Commands = {}
  command.split('+').forEach((item) => {
    if (item === 'alt') commands.altKey = true
    else if (item === 'ctrl') {
      commands.ctrlKey = true
    } else if (item === 'control') {
      commands.ctrlKey = true
    } else if (item === 'shift') {
      commands.shiftKey = true
    } else commands.key = item // Store regular keys but add something so we know it uses modifiers
  })
  // reformat storage name
  return getCommandString(commands)
}

// bindEvents
export const bindEvents = (): void => {
  // Key down event listener
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    const commandString = getCommandString(event)
    const hotkey = storage[commandString]
    if (hotkey !== undefined && !hotkey.pressed) {
      // Prevent default browser hotkeys
      event.preventDefault()
      if (hotkey.down !== null) hotkey.down()
      hotkey.pressed = true
    }
  })

  // Key up event listener
  document.addEventListener('keyup', (event: KeyboardEvent) => {
    const hotkey = storage[getCommandString(event)]

    if (hotkey !== undefined) {
      if (hotkey.up !== null) hotkey.up()
      hotkey.pressed = false
    }
  })
}

// Initialization boolean for doing things only once
let initialized = false

// Save last key so we can find it for adding up and down methods
let lastKey: LastKey = null

/**
 * Set one hotkey
 * @param command string hotkey command
 * @param alternateUp  callback
 */
export const hotkey: HotkeyAssignmentFunction = (command, alternateUp) => {
  // Initialize only once
  if (!initialized) {
    bindEvents()
    initialized = true
  }
  // Command is combined: ctlr+z
  if (command.length > 1 && command.includes('+')) {
    lastKey = formatCommandString(command)

    // Command is single modifier: shift, ctrl, space enter, backspace, ect
    // Or its a single letter a, b, c, d
  } else {
    lastKey = command
  }

  // Create blank new hotkey and use callback if provided here
  if (storage[lastKey] === undefined) {
    storage[lastKey] = new HotkeyInstance(
      alternateUp !== undefined ? alternateUp : null
    )
  }

  // Allow changing methods
  return { up, down }
}

/**
 * Set callback for down
 * @param callback () => void
 */
const down: Down = (callback) => {
  // Store "down" callback with last command
  if (callback !== undefined && lastKey !== null) {
    storage[lastKey].down = callback
  }
  // Allow chaining methods
  return { up }
}

/**
 * Set callback for up
 * @param callback () => void
 */
const up: Up = (callback) => {
  // Store "up" callback with last command
  if (callback !== undefined && lastKey !== null) {
    storage[lastKey].up = callback
  }
  // Allow changing methods
  return { down }
}

// Chain removal function
hotkey.remove = (command) => {
  if (storage[formatCommandString(command)] !== undefined) {
    delete storage[formatCommandString(command)]
  }
}
