'use strict';

//Nazaire's JavaScript Engine
var nJSE = nJSE || {};

nJSE.main = {
  init: function () {
    this.timeStamp = Date.now();
    this.timeSpeed = 1;
    this.deltaTime = 0;

    this.noParent = true;
    this.noParent0 = true;

    nJSE.input.init(document.getElementById("canvasContainer"));

    nJSE.renderer.init();

    nJSE.assets.init();

    nJSE.components.init();

    nJSE.entities.default();
    nJSE.entities.default();
    nJSE.entities.default();

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
        this.noParent = false;
      } else {
        nJSE.components.heirarchy.unparentByIndex(1);
        nJSE.components.collider.debugColor = "#0f0";
        this.noParent = true;
      }
    }

    if (nJSE.input.keyPressed[nJSE.input.keys.boost]) {
      if (this.noParent0) {
        nJSE.components.heirarchy.parentByIndex(2, 1);
        this.noParent0 = false;
      } else {
        nJSE.components.heirarchy.unparentByIndex(2);
        this.noParent0 = true;
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

    nJSE.components.transform.bufferRotations[1] += this.deltaTime * 2.5;

    nJSE.components.update(this.deltaTime);

    nJSE.renderer.update(this.deltaTime);

    // Quick test end

    nJSE.components.draw();

    nJSE.renderer.draw();

    this.timeStamp = Date.now();
    requestAnimationFrame(this.step.bind(nJSE.main));
  }
};

window.onload = nJSE.main.init.bind(nJSE.main);