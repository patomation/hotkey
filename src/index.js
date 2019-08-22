const storage = {}

class Hotkey {
  constructor(callback){
    this.key = null;
    this.keys = []; //Handle multiple keys?
    this.altKey = false; //Boolean
    this.ctrlKey = false; //Boolean
    this.shiftKey = false; //Boolean
    this.up = callback || null; //Function
    this.down = null; //Function
  }
}

//Save last key so we can find it for adding up and down methods
let lastKey = null;

//Set one hotkey
const set = (command, callback) => {

  //Create blank new hotkey and use callback if provided here
  let hotkey = new Hotkey(callback);

  //Collect Modifiers
  command.split('+').forEach( item => {
    if(item === 'alt') hotkey.shiftKey = true;
    else if(item === 'ctrl') hotkey.ctrlKey = true;
    else if(item === 'control') hotkey.ctrlKey = true;
    else if(item === 'shift') hotkey.shiftKey = true;
    else hotkey.keys.push(item); // Store regular keys

  })

  lastKey = hotkey.keys[0];

  //Store hotkey command
  storage[lastKey] = hotkey;

  //Allow chainging methods
  return { up, down }
}

//Set callback for down
const down = (callback) => {
  //Store "down" callback with last command
  if (callback) storage[lastKey].down = callback;
  //Allow chainging methods
  return { up }
}

//Set callback for up
const up = (callback) => {
  //Store "up" callback with last command
  if (callback) storage[lastKey].up = callback;
  //Allow chainging methods
  return { down }
}


//Key down event listener
document.onkeydown = (event) => {
  // If key stored
  const hotkey = storage[event.key.toLowerCase()];
  if (hotkey !== undefined) {
      // if Modifiers used and match what is defined
      if (
        hotkey.altKey === event.altKey &&
        hotkey.ctrlKey === event.ctrlKey &&
        hotkey.shiftKey === event.shiftKey
      ) {
        //Run command if defined
        if(hotkey.down) hotkey.down()
      }
  }
}

//Key up event listener
document.onkeyup = (event) => {
  // If key stored
  const hotkey = storage[event.key.toLowerCase()];
  if (hotkey !== undefined) {
      // if Modifiers used and match what is defined
      if (
        hotkey.altKey === event.altKey &&
        hotkey.ctrlKey === event.ctrlKey &&
        hotkey.shiftKey === event.shiftKey
      ) {
        //Run command
        if(hotkey.up) hotkey.up()
      }
  }
}


//Expose only set with down and up methods
module.exports = set;
