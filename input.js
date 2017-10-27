'use strict';

//Nazaire's JavaScript Engine
var nJSE = nJSE || {};

//keeps track of relevant key states and mouse states
nJSE.input = {
  // daemon of the keys we'll be using
  keys: Object.freeze({
    boost: 'Space',
    up: 'KeyW',
    left: 'KeyA',
    down: 'KeyS',
    right: 'KeyD'
  }),
  keyPressed: [], // for when the key has just been pressed
  keyPressedBuffer: [], // For the update method, to allow at least one step for keypresses
  keyDown: [], // for when the key is down
  //a constant describing the buttons of the mouse
  buttons: Object.freeze({
    left: 0,
    middle: 1,
    right: 2,
  }),
  mousePressed: [],
  mousePressedBuffer: [],
  mouseDown: [],
  //where the mouse is on the mouseTarget, with topleft being (0, 0)
  mousePosition: [0, 0],
  //the target that mouse position will be based off of 
  mouseTarget: document,
  //when initialized, this will add hooks to capture mouse events
  init: function (mouseTarget) {
    //set up the key bindings to 0 (not pressed / down)
    // learned of "hasOwnProperty" from Dominik of StackOverflow
    for (let i in this.keys)
      if (this.keys.hasOwnProperty(i)) {
        this.keyPressed[this.keys[i]] = 0;
        this.keyPressedBuffer[this.keys[i]] = 0;
        this.keyDown[this.keys[i]] = 0;
      }

    //set up the mouse binding to 0 (not pressed / down)
    for (let i in this.buttons)
      if (this.buttons.hasOwnProperty(i)) {
        this.mousePressed[this.buttons[i]] = 0;
        this.mousePressedBuffer[this.buttons[i]] = 0;
        this.mouseDown[this.buttons[i]] = 0;
      }

    this.mouseTarget = mouseTarget;

    document.addEventListener("mousemove", (e) => {
      //setting mouse position relative to top-left of target
      this.mousePosition = [e.pageX - this.mouseTarget.offsetLeft, e.pageY - this.mouseTarget.offsetTop];
    });

    //if the mouse is not already down, then the mouse was just pressed
    document.addEventListener("mousedown", (e) => {
      if (this.mouseDown[e.button] != 1) {
        this.mousePressed[e.button] = 1;
        this.mousePressedBuffer[e.button] = 1;
      }
      this.mouseDown[e.button] = 1;
    });

    //the mouse was released, everything about it is 0 0_0
    document.addEventListener("mouseup", (e) => {
      this.mousePressed[e.button] = 0;
      this.mousePressedBuffer[e.button] = 0;
      this.mouseDown[e.button] = 0;
    });

    //this will keep the right click menu from popping up
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    //similar to mouseevent code:
    window.addEventListener("keypress", (e) => {
      if (this.keyDown[e.code] != 1) {
        this.keyPressed[e.code] = 1;
        this.keyPressedBuffer[e.code] = 1;
      }
      this.keyDown[e.code] = 1;
    });

    //similar to mouseevent code:
    window.addEventListener("keyup", (e) => {
      this.keyPressed[e.code] = 0;
      this.keyPressedBuffer[e.code] = 0;
      this.keyDown[e.code] = 0;
    });
  },
  //update just checks the pressedBuffers, then sets them to 0
  //if the buffers are already 0, then it sets the actual pressed events to 0
  update: function () {
    for (let i in this.keys)
      if (this.keys.hasOwnProperty(i)) {
        let keyIndex = this.keys[i];

        if (this.keyPressedBuffer[keyIndex])
          this.keyPressedBuffer[keyIndex] = 0;
        else if (this.keyPressed[keyIndex])
          this.keyPressed[keyIndex] = 0;
      }

    for (let i in this.buttons)
      if (this.buttons.hasOwnProperty(i)) {
        let buttonIndex = this.buttons[i];

        if (this.mousePressedBuffer[buttonIndex])
          this.mousePressedBuffer[buttonIndex] = 0;
        else if (this.mousePressed[buttonIndex])
          this.mousePressed[buttonIndex] = 0;
      }
  }
};