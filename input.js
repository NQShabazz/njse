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
    mousePosition: Vector.zero,
    //the target that mouse position will be based off of 
    mouseTarget: document,
    //when initialized, this will add hooks to capture mouse events
    init: function(mouseTarget){
        //set up the key bindings to false (not pressed / down)
        // learned of "hasOwnProperty" from Dominik of StackOverflow
        for(let i in this.keys)
            if (this.keys.hasOwnProperty(i)) {
                this.keyPressed[this.keys[i]] = false;
                this.keyPressedBuffer[this.keys[i]] = false;
                this.keyDown[this.keys[i]] = false;
            }
        
        //set up the mouse binding to false (not pressed / down)
        for(let i in this.buttons)
            if (this.buttons.hasOwnProperty(i)) {
                this.mousePressed[this.buttons[i]] = false;
                this.mousePressedBuffer[this.buttons[i]] = false;
                this.mouseDown[this.buttons[i]] = false;
            }
        
        this.mouseTarget = mouseTarget;
        
        document.addEventListener("mousemove", (e) => {
            //setting mouse position relative to top-left of target
            this.mousePosition.setTo(e.pageX - this.mouseTarget.offsetLeft, e.pageY - this.mouseTarget.offsetTop);
        });
        
        //if the mouse is not already down, then the mouse was just pressed
        document.addEventListener("mousedown", (e) => {
            if(this.mouseDown[e.button] != true){
                this.mousePressed[e.button] = true;
                this.mousePressedBuffer[e.button] = true;
            }
            this.mouseDown[e.button] = true;
        });
        
        //the mouse was released, everything about it is false 0_0
        document.addEventListener("mouseup", (e) => {
            this.mousePressed[e.button] = false;
            this.mousePressedBuffer[e.button] = false;
            this.mouseDown[e.button] = false;
        });
        
        //this will keep the right click menu from popping up
        document.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });
        
        //similar to mouseevent code:
        window.addEventListener("keypress", (e) => {
            if(this.keyDown[e.code] != true){
                this.keyPressed[e.code] = true;
                this.keyPressedBuffer[e.code] = true;
            }
            this.keyDown[e.code] = true;
        });

        //similar to mouseevent code:
        window.addEventListener("keyup", (e) => {
            this.keyPressed[e.code] = false;
            this.keyPressedBuffer[e.code] = false;
            this.keyDown[e.code] = false;
        });
    },
    //update just checks the pressedBuffers, the nsets then to false
    //if the buffers are already false, then it sets the actual pressed events to false
    update: function(){        
        for(let i in this.keys)
            if (this.keys.hasOwnProperty(i)) {
                var keyIndex = this.keys[i];
                
                if(this.keyPressedBuffer[keyIndex])
                    this.keyPressedBuffer[keyIndex] = false;
                else if(this.keyPressed[keyIndex])
                    this.keyPressed[keyIndex] = false;
            }
        
        for(let i in this.buttons)
            if (this.buttons.hasOwnProperty(i)) {
                var buttonIndex = this.buttons[i];
                
                if(this.mousePressedBuffer[buttonIndex])
                    this.mousePressedBuffer[buttonIndex] = false;
                else if(this.mousePressed[buttonIndex])
                    this.mousePressed[buttonIndex] = false;
            }
    }
};