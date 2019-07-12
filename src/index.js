const hotkey = {
  initialized: false,
  storage: {},
  modifyer: null,
  bind(key, callback){
    //Store hotkey callback
    this.storeHotkey(key, callback);

    //Run initialization tasks only once
    if(!this.initialized){
      this.bindEvents();
      this.initialized = true;
    }
  },

  bindEvents(){
    document.onkeyup = (e) => {
        //Handle One Modifyer + a keypress at a time
        if(this.modifyer !== null && !this.isModifyer(e.key) ){
          this.checkAndRunCommand(this.modifyer + '+' + e.key.toLowerCase() );
          //Make sure to clear modifyer
          this.modifyer = null;
        //Handle single key press
        } else if( !this.isModifyer(e.key) ) {
          this.checkAndRunCommand(e.key.toLowerCase() );
        }

      }
    document.onkeydown = (e) => {
        //Handle modifyer keys
        if(this.isModifyer(e.key)){
          //Save modifyer
          this.modifyer = e.key.toLowerCase();
        }
      }
  },

  checkAndRunCommand(command){
    console.log(command);
    //See if property exists
    if(this.storage.hasOwnProperty(command)){
      //Run callback
      this.storage[command]();
    }
  },

  isModifyer(key){
    return (key === 'Shift' || key === 'Control' || key === 'Command')
  },

  storeHotkey(key, callback){
    this.storage[key] = callback;
  }
}


module.exports = hotkey;
