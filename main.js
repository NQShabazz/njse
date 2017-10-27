'use strict';

//Nazaire's JavaScript Engine
var nJSE = nJSE || {};

nJSE.main = {
  init: function () {
    this.timeStamp = Date.now();
    this.timeSpeed = 1;
    this.deltaTime = 0;
    
    nJSE.input.init(document.getElementById("canvasContainer"));

    nJSE.renderer.init();

    nJSE.components.init();
    
    this.initSprites();
    this.initAudio();

    nJSE.components.defaultEntity.create();
    nJSE.components.audio.setAudio(0, 0, 1, 0.5, 1);
    nJSE.components.audio.setAudio(0, 2, 8, 0.5, 0);
    nJSE.components.audio.playAudio(0, 0);

    this.step();
  },
  step: function () {
    this.deltaTime = (Date.now() - this.timeStamp) * 0.001 * this.timeSpeed;

    nJSE.input.update();

    //Quick test start
    nJSE.components.transform.setPos(0, [nJSE.input.mousePosition[0], nJSE.input.mousePosition[1], 0]);
    
    if(nJSE.input.mousePressed[0] || nJSE.input.mousePressed[2])
      nJSE.components.audio.playAudio(0, 1);
    
    if (nJSE.input.mouseDown[0])
      nJSE.components.transform.dRot[0] -= this.deltaTime * 5;
    if (nJSE.input.mouseDown[2])
      nJSE.components.transform.dRot[0] += this.deltaTime * 5;

    if (nJSE.input.keyDown[nJSE.input.keys.down])
      nJSE.components.transform.dScl[0] = [nJSE.components.transform.dScl[0][0] - 5*this.deltaTime, nJSE.components.transform.dScl[0][1] - 5*this.deltaTime];
    if (nJSE.input.keyDown[nJSE.input.keys.up])
      nJSE.components.transform.dScl[0] = [nJSE.components.transform.dScl[0][0] + 5*this.deltaTime, nJSE.components.transform.dScl[0][1] + 5*this.deltaTime];

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