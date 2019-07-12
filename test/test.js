'use strict';

var expect = require('chai').expect;
var hotkey = require('../src/index');

//Emulate global dom
require('jsdom-global')()

describe('#hotkey', function() {
    it('should not be initialized', function() {
        var result = hotkey.initialized;
        expect(result).to.equal(false);
    });

    it('has a storage object', function() {
        var result = hotkey.storage;
        expect( typeof result ).to.equal('object');
    });

    it('modifyer is null', function() {
        var result = hotkey.modifyer;
        expect( result ).to.equal(null);
    });

    var aCallback = function(){
      return 'a pressed';
    }
    it('Binds Hotkey without error', function() {
        var result = false;
        try{
          hotkey.bind('a', aCallback);
          result = true;
        } catch(error) {
          result = false;
        }
        expect( result ).to.equal(true);
    });

    it('Stored hotkey not undefined and equal same function', function() {
        var result = hotkey.storage.a;
        expect( result ).to.equal(aCallback);
    });

    it('Hotkey is initialized', function() {
        var result = hotkey.initialized;
        expect( result ).to.equal(true);
    });

    //Test Modifyer key
    var controllAcallback = function(){
      return "Controll + a pressed"
    }
    it('Binds Controll + Hotkey without error', function() {
        var result = false;
        try{
          hotkey.bind('controll+a', controllAcallback);
          result = true;
        } catch(error) {
          result = false;
        }
        expect( result ).to.equal(true);
    });

    it('Stored Controll + hotkey not undefined and equal same function', function() {
        var result = hotkey.storage['controll+a'];
        expect( result ).to.equal(controllAcallback);
    });


});
