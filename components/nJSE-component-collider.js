'use strict';

//collider COMPONENT
nJSE.components.collider = nJSE.components.base();
nJSE.components.collider.onInit = function () {
  this.debugColor = "#0f0";
  this.debugCanvasCtx = nJSE.renderer.createCanvas("colliderDebugCanvas", 90).getContext("2d");
  this.drawDebug = 1;
  this.twoPI = Math.PI * 2;
  this.r2o2 = Math.sqrt(2) * 0.5;
  
  this.colliderPoints = [];
  this.colliderPDescs = [];
  this.colliderDepthsAndRadii = [];
  this.collidingAsCircle = [];
  this.collisions0 = [];
  this.collisions1 = [];
  this.collisionPoints = [];
  this.angleOffset = [];
  this.transformIndices = [];
};
nJSE.components.collider.onCreate = function (id) {
  let index = this.entityIDs.length - 1;

  // x, y of each point
  this.colliderPoints[index] = [[0, 0]];
  // length squared, angle of each point
  this.colliderPDescs[index] = [[1, 0]];
  // how far to check for collision (circle vs. precise), maximum radius
  this.colliderDepthsAndRadii[index] = [1, 1];
  // colliding as circle or as square for the first check
  this.collidingAsCircle[index] = 0;

  this.collisions0[index] = [];
  this.collisions1[index] = [];
  
  this.collisionPoints[index] = [];

  this.transformIndices[index] = nJSE.components.transform.indexOf(id, 1);
};
nJSE.components.collider.setCollisionAsCircle = function (index, isCircle) {
  this.collidingAsCircle[index] = isC;
};
nJSE.components.collider.setShape = function (index, radius, numSides, angleOffset) {
  this.colliderPoints[index] = new Array(numSides);
  this.colliderPDescs[index] = new Array(numSides);

  var i = numSides;

  while (i--) {
    let angle = this.twoPI * i / numSides;

    this.colliderPoints[index][i] = [radius * Math.cos(angleOffset + this.twoPI * i / numSides), radius * Math.sin(angleOffset + this.twoPI * i / numSides)];
    this.colliderPDescs[index][i] = [radius * radius, angleOffset + angle];
  }

  this.colliderDepthsAndRadii[index][1] = (radius);
};
nJSE.components.collider.setPoints = function (index, pointArray) {
  this.colliderPoints[index] = pointArray;
  this.colliderPDescs[index] = new Array(pointArray.length);

  let maxRadius = this.lengthSquared(pointArray[i]);
  var i = pointArray.length;

  while (i--) {
    let lengthSquared = this.lengthSquared(pointArray[i]);

    this.colliderPDescs[index][i] = [lengthSquared, Math.atan2(pointArray[i][1], pointArray[i][0])];

    if (lengthSquared > maxRadius)
      maxRadius = lengthSquared;
  }

  this.colliderDepthsAndRadii[index][1] = Math.sqrt(maxRadius);
};
nJSE.components.collider.onUpdate = function (deltaTime) {
  var i = this.entityIDs.length;

  while (i--) {
    while (this.collisions0[i].length)
      this.collisions0[i].pop();
    while (this.collisions1[i].length)
      this.collisions1[i].pop();
    while (this.collisionPoints[i].length)
      this.collisionPoints[i].pop();
  }

  i = this.entityIDs.length;

  while (i--) {
    if(!this.activeStates[i])
      continue;
    
    let iPosition = nJSE.components.transform.pos[this.transformIndices[i]];
    let iRotation = nJSE.components.transform.rot[this.transformIndices[i]];
    var j = i;

    while (j-- > 0) {
      let jPosition = nJSE.components.transform.pos[this.transformIndices[j]],
          iScale = nJSE.components.transform.scl[this.transformIndices[i]],
          jScale = nJSE.components.transform.scl[this.transformIndices[j]],
          iRadius = this.colliderDepthsAndRadii[i][1], jRadius = this.colliderDepthsAndRadii[j][1],
          iRect = [iPosition[0] - iRadius * iScale[0] * this.r2o2, iPosition[1] - iRadius * iScale[1] * this.r2o2, 2 * iRadius * iScale[0] * this.r2o2, 2 * iRadius * iScale[1] * this.r2o2],
          jRect = [jPosition[0] - jRadius * jScale[0] * this.r2o2, jPosition[1] - jRadius * jScale[1] * this.r2o2, 2 * jRadius * jScale[0] * this.r2o2, 2 * jRadius * jScale[1] * this.r2o2],
          distSquared = this.lengthSquared(this.subtract(jPosition, iPosition)),
          collisionDetected = false;
      
      if ((this.collidingAsCircle[i] && this.collidingAsCircle[j] && distSquared < Math.pow(iRadius * Math.max(iScale[0], iScale[1]) + jRadius * Math.max(jScale[0], jScale[1]), 2)) || ((!(this.collidingAsCircle[i] && this.collidingAsCircle[j])) && iRect[0] < jRect[0] + jRect[2] && iRect[0] + iRect[2] > jRect[0] && iRect[1] < jRect[1] + jRect[3] && iRect[3] + iRect[1] > jRect[1])){
        let angle = this.angle(this.subtract(jPosition, iPosition));
        
        this.collisions0[i].push([this.entityIDs[j], angle]);
        this.collisions0[j].push([this.entityIDs[i], (angle + Math.PI)%(this.twoPI)]);
        
        collisionDetected = true;
      }
      
      if(collisionDetected && (this.colliderDepthsAndRadii[i][0] || this.colliderDepthsAndRadii[j][0])){
        //do in-depth collision test (something more precise that gives collision depth)...
        //this.collisions1[i].push([this.entityIDs[j], angle, collisionDepth])
        //this.collisions1[j].push([this.entityIDs[i], angle, collisionDepth])
      }
    }
  }
};
nJSE.components.collider.onDraw = function () {
  if (this.drawDebug) {
    var i = this.entityIDs.length;

    this.debugCanvasCtx.clearRect(0, 0, nJSE.WIDTH, nJSE.HEIGHT);

    while (i--) {
      let trns = nJSE.components.transform.matrix[this.transformIndices[i]];
      
      var j = this.colliderPoints[i].length;

      let endPoint = this.colliderPoints[i][j - 1];

      this.debugCanvasCtx.setTransform(trns[0], trns[3], trns[1], trns[4], trns[2], trns[5]);

      this.debugCanvasCtx.strokeStyle = this.collisions0[i].length > 0 ? "red" : this.debugColor;

      this.debugCanvasCtx.beginPath();

      this.debugCanvasCtx.moveTo(0, 0);

      while (j--)
        this.debugCanvasCtx.lineTo(this.colliderPoints[i][j][0], this.colliderPoints[i][j][1]);
      
      this.debugCanvasCtx.lineTo(endPoint[0], endPoint[1]);
      this.debugCanvasCtx.stroke();
    }
  }
};
nJSE.components.collider.lengthSquared = function(v){
  return v[0] * v[0] + v[1] * v[1];
};
//subtracts vector y from vector x, as in (x - y)
nJSE.components.collider.subtract = function(x, y){
  return [x[0] - y[0], x[1] - y[1]];
}
//gets angle of vector
nJSE.components.collider.angle = function(v){
  return Math.atan2(v[1], v[0]);
}