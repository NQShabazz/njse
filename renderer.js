'use strict';

//Nazaire's JavaScript Engine
var nJSE = nJSE || {};

nJSE.WIDTH = nJSE.WIDTH || 800;
nJSE.HEIGHT = nJSE.HEIGHT || 600;

nJSE.drawDebug = true;

nJSE.renderer = {
  canvases: [],
  contexts: [],
  canvasCount: 0,
  updateTimer: 0,
  init: function () {
    this.mainCanvasCtx = this.createCanvas("mainCanvas", 99, true).getContext("2d");
    this.elementContainer = document.getElementById("elementContainer")
    this.fpsDisplay = this.createElement('h2', "fpsDisplay", true);
  },
  getCanvasById: function (id) {
    let canvas = document.getElementById(id);

    if (!canvas)
      return this.createCanvas(id, -1);

    return canvas;
  },
  getCanvas: function (index) {
    if (!this.canvases[index])
      return this.createCanvas("canvas" + this.canvases.length, index);

    return this.canvases[index];
  },
  createCanvas: function (id, index, addToBody) {
    let canvas = document.createElement('canvas');

    if (index === -1)
      index = this.canvasCount - 1;

    let breakPoint = index % 99;

    while (this.canvases[index] || (this.canvasCount > 0 && index > 98)) {
      index = (index + 1) % 99;

      //At this point we have no choice but to replace a canvas
      if (index === breakPoint)
        break;
    }

    canvas.id = id;
    canvas.width = nJSE.WIDTH;
    canvas.height = nJSE.HEIGHT;
    canvas.style.zIndex = index;

    if (addToBody) {
      let canvasContainer = document.getElementById("canvasContainer");

      if (canvasContainer === null) {
        canvasContainer = document.createElement("div");
        canvasContainer.id = "canvasContainer";

        document.body.appendChild(canvasContainer);
      }

      canvasContainer.appendChild(canvas);
    }

    this.canvases[index] = canvas;
    this.contexts[index] = canvas.getContext("2d");

    this.canvasCount++;

    return this.canvases[index];
  },
  createElement: function (tag, id, classes) {
    let elem = document.createElement(tag);

    elem.id = id;
    elem.innerText = "FPS | 60";

    if (classes) {
      if (Array.isArray(classes))
        elem.classList.add(...classes);
      else if (classes === true)
        elem.classList.add("debug");
      else
        elem.classList.add(classes);
    }

    this.elementContainer.appendChild(elem);

    return elem;
  },
  update: function (deltaTime) {
    if (nJSE.drawDebug) {
      this.updateTimer -= deltaTime;

      if (this.updateTimer < 0) {
        this.fpsDisplay.innerText = "FPS | " + Math.round(1 / deltaTime);

        this.updateTimer = 0.25;
      }
    }
  },
  draw: function () {
    var i = this.canvases.length,
      len = i - 2;

    this.mainCanvasCtx.clearRect(0, 0, nJSE.WIDTH, nJSE.HEIGHT);

    while (i--) {
      let index = len - i;

      if (index < 99 && this.canvases[index]) {
        this.mainCanvasCtx.drawImage(this.canvases[index], 0, 0);

        this.contexts[index].setTransform(1, 0, 0, 1, 0, 0);
        this.contexts[index].clearRect(0, 0, nJSE.WIDTH, nJSE.HEIGHT);
      }
    }
  }
};