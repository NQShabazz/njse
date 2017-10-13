'use strict';

//Nazaire's JavaScript Engine
var nJSE = nJSE || {};

nJSE.WIDTH = nJSE.WIDTH || 800;
nJSE.HEIGHT = nJSE.HEIGHT || 600;

//basically the place I load all the images and sounds I'll be using. I had plans for more stuff, but it just didn't happen
nJSE.assets = {
  init: function () {
    this.imageCanvases = [];
    this.sounds = [];

    this.testCanvas = document.createElement('canvas');
    document.getElementById('canvasContainer').appendChild(this.testCanvas);
    this.testCanvas.width = nJSE.WIDTH;
    this.testCanvas.height = nJSE.HEIGHT;

    this.srcPrefix = "assets/";

    this.addImage("empty", "empty.png");
    this.addImage("white", "white.png");
    this.addImage("cursor", "cursor.png");
    this.addImage("background", "background.png");
    this.addImage("bgStar0", "bgStar0.png");
    this.addImage("bgStar1", "bgStar1.png");
    this.addImage("asteroid0", "asteroid0.png");
    this.addImage("asteroid1", "asteroid1.png");
    this.addImage("asteroid2", "asteroid2.png");
    this.addImage("playerEye", "playerEye.png");
    this.addImage("playerAsteroid", "playerAsteroid.png");
    this.addImage("enemy", "enemy.png");

    //        this.addSound("bgMusic", "bgMusic.wav", 1);
    //        this.addSound("explosion", "explosion.wav", 10);
    //        this.addSound("shot", "shot.wav", 5);
    //        this.addSound("charge", "charge.wav", 1);
  },
  addSound: function (name, src, numInstances) {

  },
  //not using names for now
  addImage: function (name, src) {
    let len = this.imageCanvases.length,
      img = new Image();

    nJSE.assets.imageCanvases[len] = document.createElement('canvas');

    img.index = len;
    img.src = this.srcPrefix + src;
    img.onload = function () {
      let canvas = nJSE.assets.imageCanvases[img.index];

      canvas.width = img.width;
      canvas.height = img.height;

      canvas.getContext('2d').drawImage(img, 0, 0);
    };
  }
};