interface HotkeyStorage { [key: string]: Hotkey }

export const storage: HotkeyStorage = {}

type Callback = () => void

export class Hotkey {
  constructor (alternateUp?: Callback | null) {
    this.up = alternateUp !== undefined && alternateUp !== undefined ? alternateUp : null // Function
    this.down = null // Function
    this.pressed = false // Boolean - only let us press once
  }

  up: null | Callback
  down: null | Callback
  pressed: boolean
}

type CommandString = string

type LastKey = CommandString | null

type Up = (arg0?: Callback) => ({
  down: Down
})

type Down = (arg0?: Callback) => ({
  up: Up
})

type Remove = (arg0: CommandString) => void

interface Commands {
  altKey?: boolean
  ctrlKey?: boolean
  shiftKey?: boolean
  key?: string
}

export interface HotkeyAsignment {
  (command: CommandString, callback?: Callback): { up: Up, down: Down}
  remove: Remove
}

export const getCommandString = ({
  altKey,
  ctrlKey,
  shiftKey,
  key
}: Commands): CommandString => {
  let string = ''
  if (altKey !== undefined && altKey && key !== 'alt') string += 'alt+'
  if (ctrlKey !== undefined && ctrlKey && key !== 'control') string += 'ctrl+'
  if (shiftKey !== undefined && shiftKey && key !== 'shift') string += 'shift+'
  if (key !== undefined) key = key.toLowerCase() // Force lowercase
  // Handle space and regular keys
  if (key !== undefined) string += key === ' ' ? 'space' : key

  return string
}

export const formatCommandString = (command: CommandString): CommandString => {
  // Collect Modifiers
  const commands: Commands = {}
  command.split('+').forEach(item => {
    if (item === 'alt') commands.altKey = true
    else if (item === 'ctrl') commands.ctrlKey = true
    else if (item === 'control') commands.ctrlKey = true
    else if (item === 'shift') commands.shiftKey = true
    else commands.key = item // Store regular keys but add something so we know it uses modifyers
  })
  // reformat storage name
  return getCommandString(commands)
}

// bindEvents
export const bindEvents = (): void => {
  // Key down event listener
  document.onkeydown = (event: KeyboardEvent) => {
    const hotkey = storage[
      getCommandString(event)
    ]
    if (hotkey !== undefined && !hotkey.pressed) {
      if (hotkey.down !== null) hotkey.down()
      hotkey.pressed = true
    }
  }

  // Key up event listener
  document.onkeyup = (event) => {
    const hotkey = storage[getCommandString(event)]

    if (hotkey !== undefined) {
      if (hotkey.up !== null) hotkey.up()
      hotkey.pressed = false
    }
  }
}

// Initialization boolean for doing things only once
let initialized = false

// Save last key so we can find it for adding up and down methods
let lastKey: LastKey = null

// Set one hotkey
const hotkey: HotkeyAsignment = (command, alternateUp) => {
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
  if (storage[lastKey] === undefined) storage[lastKey] = new Hotkey(alternateUp !== undefined ? alternateUp : null)

  // Allow changing methods
  return { up, down }
}

// Set callback for down
const down: Down = (callback) => {
  // Store "down" callback with last command
  if (callback !== undefined && lastKey !== null) storage[lastKey].down = callback
  // Allow chaining methods
  return { up }
}

// Set callback for up
const up: Up = (callback) => {
  // Store "up" callback with last command
  if (callback !== undefined && lastKey !== null) storage[lastKey].up = callback
  // Allow changing methods
  return { down }
}

// Expose removal function
hotkey.remove = (command: CommandString) => {
  if (storage[formatCommandString(command)] !== undefined) delete storage[formatCommandString(command)]
}

// Expose only set with down and up methods
export default hotkey
