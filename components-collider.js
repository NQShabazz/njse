'use strict';

//physics COMPONENT
nJSE.components.physics = nJSE.components.base();
nJSE.components.physics.onInit = function () {
  this.debugColor = "#0f0";
  this.twoPI = Math.PI * 2;
  this.radii = [];
  this.collisionIndices = [];
  this.transformIndices = [];
  this.debugCanvasCtx = nJSE.renderer.createCanvas("physicsDebugCanvas", 90).getContext("2d");
};
nJSE.components.physics.onCreate = function (id) {
  let index = this.entityIDs.length - 1;

  this.radii[index] = 25;
  this.collisionIndices[index] = [];
  this.transformIndices[index] = nJSE.components.transform.indexOf(id, true);
};
nJSE.components.physics.onUpdate = function (deltaTime) {
  var i = this.entityIDs.length;

  while (i--) {
    
  }
};
nJSE.components.physics.onDraw = function () {
  if (nJSE.drawDebug) {
    var i = this.entityIDs.length;

    this.debugCanvasCtx.clearRect(0, 0, nJSE.WIDTH, nJSE.HEIGHT);
    this.debugCanvasCtx.strokeStyle = this.debugColor;

    this.debugCanvasCtx.beginPath();

    while (i--) {
      let pos = nJSE.components.transform.positions[this.transformIndices[i]];
      let rotation = nJSE.components.transform.rotations[this.transformIndices[i]];
      let scale = nJSE.components.transform.scales[this.transformIndices[i]].x;

      this.debugCanvasCtx.moveTo(Math.round(pos.x), Math.round(pos.y));
      this.debugCanvasCtx.arc(Math.round(pos.x), Math.round(pos.y), Math.abs(this.radii[i] * scale), rotation, rotation + this.twoPI);
    }

    this.debugCanvasCtx.stroke();
  }
};
// DO CIRCLE2CIRCLE ONLY FIRST, THEN DO AABB ONLY, THEN ALLOW FOR MIXTURE
nJSE.components.physics.circle2Circle = function (indexA, indexB) {

};
nJSE.components.physics.AABB2AABB = function (indexA, indexB) {

};
nJSE.components.physics.circle2AABB = function (indexA, indexB) {

};