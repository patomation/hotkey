const storage = {}

const addToStorage = (key, hotkey) => {
  if(!storage[key]) storage[key] = []
  storage[key].push( hotkey );
}

class Hotkey {
  constructor(callback){
    this.key = null;
    this.keys = []; //Handle multiple keys?
    this.altKey = false; //Boolean
    this.ctrlKey = false; //Boolean
    this.shiftKey = false; //Boolean
    this.up = callback || null; //Function
    this.down = null; //Function
    this.pressed = false; //Boolean - only let us press once
  }
}

//Save last key so we can find it for adding up and down methods
let lastKey = null;

//Set one hotkey
const set = (command, callback) => {

  //Create blank new hotkey and use callback if provided here
  let hotkey = new Hotkey(callback);

  //Command is combined: ctlr+z
  if(command.length > 1 && command.includes('+')){
    let key = null;
    //Collect Modifiers
    command.split('+').forEach( item => {
      if(item === 'alt') hotkey.altKey = true;
      else if(item === 'ctrl') hotkey.ctrlKey = true;
      else if(item === 'control') hotkey.ctrlKey = true;
      else if(item === 'shift') hotkey.shiftKey = true;
      else key = item; // Store regular keys
    })
    addToStorage(key, hotkey)
    lastKey = key;

  //Command is single modifier: shift, ctrl, space enter, backspace, ect
  } else if (command.length > 1) {
    addToStorage(command, hotkey)
    lastKey = command;

  //Command is single key
  } else {
    //Make new array if command used for the first time
    addToStorage(command, hotkey)
    lastKey = command;
  }

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
  const key = format(event.key);
  if(storage[key]){
    //Check each hotkey stored under command
    storage[key].forEach(hotkey => {
      if (
        hotkey.altKey === event.altKey &&
        hotkey.ctrlKey === event.ctrlKey &&
        hotkey.shiftKey === event.shiftKey &&
        !hotkey.pressed
      ) {
        //Run command if defined
        if(hotkey.down) hotkey.down()
        //Prevents retriggering when holding down key(s)
        hotkey.pressed = true;
      }
    });
  }
}

//Key up event listener
document.onkeyup = (event) => {
  const key = format(event.key);

  if(storage[key]){
    //Check each hotkey stored under command
    storage[key].forEach(hotkey => {
      if (
        hotkey.altKey === event.altKey &&
        hotkey.ctrlKey === event.ctrlKey &&
        hotkey.shiftKey === event.shiftKey
      ) {
        //Run command if defined
        if(hotkey.up) hotkey.up()
        //Prevents retriggering when holding down key(s)
        hotkey.pressed = false;
      }
    });
  }
}


//Expose only set with down and up methods
module.exports = set;
