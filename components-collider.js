'use strict';

//collider COMPONENT
nJSE.components.collider = nJSE.components.base();
nJSE.components.collider.onInit = function () {
  this.debugColor = "#0f0";
  this.twoPI = Math.PI * 2;
  this.colliderPoints = [];
  this.colliderPDescs = [];
  this.colliderDepthsAndRadii = [];
  this.collisions0 = [];
  this.collisions1 = [];
  this.transformIndices = [];
  this.debugCanvasCtx = nJSE.renderer.createCanvas("colliderDebugCanvas", 90).getContext("2d");
};
nJSE.components.collider.onCreate = function (id) {
  let index = this.entityIDs.length - 1;

  // x, y of each point
  this.colliderPoints[index] = [new Vector(0, 0)];
  // length squared, angle of each point
  this.colliderPDescs[index] = [new Vector(1, 0)];
  // how far to check for collision (circle vs. precise), maximum radius
  this.colliderDepthsAndRadii[index] = new Vector(0, 1);

  this.collisions0[index] = [];
  this.collisions1[index] = [];

  this.transformIndices[index] = nJSE.components.transform.indexOf(id, true);
};
nJSE.components.collider.setShape = function (index, radius, numSides) {
  this.colliderPoints[index] = new Array(numSides);
  this.colliderPDescs[index] = new Array(numSides);

  var i = numSides;

  while (i--) {
    let angle = this.twoPI * i / numSides;

    this.colliderPoints[index][i] = new Vector(radius * Math.cos(this.twoPI * i / numSides), radius * Math.sin(this.twoPI * i / numSides));
    this.colliderPDescs[index][i] = new Vector(radius * radius, angle);
  }

  this.colliderDepthsAndRadii[index][1] = (radius);
};
nJSE.components.collider.setPoints = function (index, pointArray) {
  this.colliderPoints[index] = pointArray;
  this.colliderPDescs[index] = new Array(pointArray.length);

  let maxRadius = pointArray[i].lengthSquared;
  var i = pointArray.length;

  while (i--) {
    let lengthSquared = pointArray[i].lengthSquared;

    this.colliderPDescs[index][i] = new Vector(lengthSquared, Math.atan2(pointArray[i].y, pointArray[i].x));

    if (lengthSquared > maxRadius)
      maxRadius = lengthSquared;
  }

  this.colliderDepthsAndRadii[index].setY(Math.sqrt(maxRadius));
};
nJSE.components.collider.onUpdate = function (deltaTime) {
  var i = this.entityIDs.length;

  while (i--) {
    while (this.collisions0[i].length > 0)
      this.collisions0[i].pop();
    while (this.collisions1[i].length > 0)
      this.collisions1[i].pop();
  }

  i = this.entityIDs.length;

  while (i--) {
    let iPosition = nJSE.components.transform.positions[this.transformIndices[i]];
    var j = i;

    while (j-- > 0) {
      let jPosition = nJSE.components.transform.positions[this.transformIndices[j]];
      let iScale = nJSE.components.transform.scales[this.transformIndices[i]];
      let jScale = nJSE.components.transform.scales[this.transformIndices[j]];
      let distSquared = jPosition.minus(iPosition).lengthSquared;

      if (distSquared < Math.pow(this.colliderDepthsAndRadii[i][1] * Math.max(iScale.x, iScale.y) +
          this.colliderDepthsAndRadii[j][1] * Math.max(jScale.x, jScale.y), 2)) {
        this.collisions0[i].push(j);
        this.collisions0[j].push(i);

        if (this.colliderDepthsAndRadii[i].x == 1 && this.colliderDepthsAndRadii[j].x == 1 &&
          /*indepth stuff*/
          true) {
          this.collisions1[i].push(j);
          this.collisions1[j].push(i);
        }
      }
    }
  }
};
nJSE.components.collider.onDraw = function () {
  if (nJSE.drawDebug) {
    var i = this.entityIDs.length;

    this.debugCanvasCtx.clearRect(0, 0, nJSE.WIDTH, nJSE.HEIGHT);

    while (i--) {
      let pos = nJSE.components.transform.positions[this.transformIndices[i]];
      let rotation = nJSE.components.transform.rotations[this.transformIndices[i]];
      let scale = nJSE.components.transform.scales[this.transformIndices[i]];
      var j = this.colliderPoints[i].length;

      let endPoint = this.colliderPoints[i][j - 1];

      this.debugCanvasCtx.setTransform(scale.x, 0, 0, scale.y, pos.x, pos.y);
      this.debugCanvasCtx.rotate(rotation);

      this.debugCanvasCtx.strokeStyle = this.collisions0[i].length > 0 ? "red" : this.debugColor;

      this.debugCanvasCtx.beginPath();

      this.debugCanvasCtx.moveTo(0, 0);

      while (j--)
        this.debugCanvasCtx.lineTo(this.colliderPoints[i][j].x, this.colliderPoints[i][j].y);

      this.debugCanvasCtx.lineTo(endPoint.x, endPoint.y);
      this.debugCanvasCtx.stroke();
    }
  }
};
// DO CIRCLE2CIRCLE ONLY FIRST, THEN DO AABB ONLY, THEN ALLOW FOR MIXTURE
nJSE.components.collider.circle2Circle = function (indexA, indexB) {

};
nJSE.components.collider.AABB2AABB = function (indexA, indexB) {

};
nJSE.components.collider.circle2AABB = function (indexA, indexB) {

};