'use strict';

//Nazaire's JavaScript Engine
var nJSE = nJSE || {};

nJSE.main = {
  init: function () {
    this.timeStamp = Date.now();
    this.timeSpeed = 1;
    this.deltaTime = 0;
    
    this.noParent = 1;
    this.noParent0 = 1;
    
    nJSE.input.init(document.getElementById("canvasContainer"));

    nJSE.renderer.init();

    nJSE.components.init();
    
    this.initAudio();
    this.initSprites();

    nJSE.entities.default();
    nJSE.entities.default();
    nJSE.components.audio.playAudio(nJSE.components.audio.indexOf(nJSE.entities.default()), 0);

    nJSE.components.transform.positions[1].setTo(nJSE.WIDTH * Math.random(), nJSE.HEIGHT * Math.random());
    nJSE.components.transform.positions[2].setTo(nJSE.WIDTH * Math.random(), nJSE.HEIGHT * Math.random());

    this.step();
  },
  step: function () {
    this.deltaTime = (Date.now() - this.timeStamp) * 0.001 * this.timeSpeed;

    nJSE.input.update();

    //Quick test start
    nJSE.components.transform.bufferPositions[0].add(nJSE.input.mousePosition.minus(nJSE.components.transform.positions[0]));

    if (nJSE.input.mousePressed[1]) {
      if (this.noParent) {
        nJSE.components.heirarchy.parentByIndex(1, 0);
        nJSE.components.collider.debugColor = "#ff0";
        this.noParent = 0;
      } else {
        nJSE.components.heirarchy.unparentByIndex(1);
        nJSE.components.collider.debugColor = "#0f0";
        this.noParent = 1;
      }
    }

    if (nJSE.input.keyPressed[nJSE.input.keys.boost]) {
      if (this.noParent0) {
        nJSE.components.heirarchy.parentByIndex(2, 1);
        this.noParent0 = 0;
      } else {
        nJSE.components.heirarchy.unparentByIndex(2);
        this.noParent0 = 1;
      }
    }
    
    if (nJSE.input.mouseDown[0])
      nJSE.components.transform.bufferRotations[0] -= this.deltaTime * 5;
    if (nJSE.input.mouseDown[2])
      nJSE.components.transform.bufferRotations[0] += this.deltaTime * 5;

    if (nJSE.input.keyDown[nJSE.input.keys.down])
      nJSE.components.transform.bufferScales[0].add((Vector.one).scaleBy(-5 * this.deltaTime));
    if (nJSE.input.keyDown[nJSE.input.keys.up])
      nJSE.components.transform.bufferScales[0].add((Vector.one).scaleBy(5 * this.deltaTime));

    //nJSE.components.transform.bufferRotations[1] += this.deltaTime * 2.5;

    nJSE.components.update(this.deltaTime);

    nJSE.renderer.update(this.deltaTime);

    // Quick test end

    nJSE.components.draw();

    nJSE.renderer.draw();

    this.timeStamp = Date.now();
    requestAnimationFrame(this.step.bind(nJSE.main));
  },
  initSprites: function(){
    let nCS = nJSE.components.sprite, prefix = "assets/";

    nCS.addImage(prefix + "empty.png");
    nCS.addImage(prefix + "white.png");
    nCS.addImage(prefix + "cursor.png");
    nCS.addImage(prefix + "background.png");
    nCS.addImage(prefix + "bgStar0.png");
    nCS.addImage(prefix + "bgStar1.png");
    nCS.addImage(prefix + "asteroid0.png");
    nCS.addImage(prefix + "asteroid1.png");
    nCS.addImage(prefix + "asteroid2.png");
    nCS.addImage(prefix + "playerEye.png");
    nCS.addImage(prefix + "playerAsteroid.png");
    nCS.addImage(prefix + "enemy.png");
  },
  initAudio: function(){
    let nCA = nJSE.components.audio, prefix = "assets/";
    
    nCA.addAudio(prefix + "bgMusic.wav");
    nCA.addAudio(prefix + "explosion.wav");
    nCA.addAudio(prefix + "shot.wav");
    nCA.addAudio(prefix + "charge.wav");
  }
};

window.onload = nJSE.main.init.bind(nJSE.main);