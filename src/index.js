const storage = {}

const addToStorage = (key, hotkey) => {
  if(!storage[key]) storage[key] = []
  storage[key].push( hotkey );
}

class Hotkey {
  constructor(callback){
    this.up = callback || null; //Function
    this.down = null; //Function
    this.pressed = false; //Boolean - only let us press once
  }
}

const getCommandString = ({
  altKey,
  ctrlKey,
  shiftKey,
  key
}) => {
  key = key.toLowerCase(); //Force lowercase
  let string = '';
  if(altKey && key !== 'alt') string += 'alt+';
  if(ctrlKey && key !== 'control') string += 'ctrl+';
  if(shiftKey && key !== 'shift') string += 'shift+';
  //Handle space and regular keys
  if(key) string += key === ' ' ? 'space' : key;

  return string;
}

//Save last key so we can find it for adding up and down methods
let lastKey = null;

//Set one hotkey
const set = (command, callback) => {

  //Command is combined: ctlr+z
  if(command.length > 1 && command.includes('+')){
    //Collect Modifiers
    let commands = {};
    command.split('+').forEach( item => {
      if(item === 'alt') commands.altKey = true;
      else if(item === 'ctrl') commands.ctrlKey = true;
      else if(item === 'control') commands.ctrlKey = true;
      else if(item === 'shift') commands.shiftKey = true;
      else commands.key = item; // Store regular keys but add something so we know it uses modifyers
    })
    //reformat storage name
    lastKey = getCommandString(commands);

  //Command is single modifier: shift, ctrl, space enter, backspace, ect
  //Or its a single letter a, b, c, d
  } else {
    lastKey = command
  }

  //Create blank new hotkey and use callback if provided here
  if(!storage[lastKey]) storage[lastKey] = new Hotkey(callback)

  //Allow chaining methods
  return { up, down }
}

//Set callback for down
const down = (callback) => {
  //Store "down" callback with last command
  if (callback) {
    let lastId = storage[lastKey].length-1;
    storage[lastKey][lastId].down = callback;
  }
  //Allow chaining methods
  return { up }
}

//Set callback for up
const up = (callback) => {
  //Store "up" callback with last command
  if (callback) {
    let lastId = storage[lastKey].length-1;
    storage[lastKey][lastId].up = callback;
  }
  //Allow chaining methods
  return { down }
}

const format = (key) => {
  key = key.toLowerCase()
  if(key === ' ') key = 'space';
  return key;
}

//Key down event listener
document.onkeydown = (event) => {
  const hotkey = storage[getCommandString(event)];
  if (hotkey !== undefined && !hotkey.pressed) {
    if (hotkey.down) hotkey.down()
    hotkey.pressed = true
  }
}

//Key up event listener
document.onkeyup = (event) => {
  const hotkey = storage[getCommandString(event)];

  if (hotkey !== undefined) {
    if (hotkey.up) hotkey.up()
    hotkey.pressed = false
  }
}


//Expose only set with down and up methods
module.exports = set;
