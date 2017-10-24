'use strict';

//TRANSFORM COMPONENT
nJSE.components.transform = nJSE.components.base();
nJSE.components.transform.onInit = function () {
  //these are the positions, rotations, and scales relative to the parent
  //they will be (0, 0), 0, and (1, 1) by default
  this.pos = [];
  this.rot = [];
  this.scl = [];
  
  //these are the changes in positions, rotations, and scales
  //they will be (0, 0), 0, and (1, 1) by default
  this.dPos = [];
  this.dRot = [];
  this.dScl = [];
  
  //these matrices of the entities
  //they will be identity by default
  this.matrix = [];
  
  this.heirarchyIndices = [];
};
nJSE.components.transform.onCreate = function (id) {
  let index = this.entityIDs.length - 1;
  
  this.pos[index] = [0, 0, 0];
  this.rot[index] = 0;
  this.scl[index] = [1, 1, 1];
  
  this.dPos[index] = [0, 0, 0];
  this.dRot[index] = 0;
  this.dScl[index] = [0, 0, 0];
  
  this.matrix[index] = [1, 0, 0, 0, 1, 0];
  
  this.heirarchyIndices[index] = nJSE.components.heirarchy.indexOf(id, 1);
};
nJSE.components.transform.onEarlyUpdate = function (deltaTime) {
  var i = this.entityIDs.length;
  
  nJSE.components.heirarchy.orderedIteration(this.heirarchyIndices, this.heirarchalFunction);

  while (i--) {
    if(this.activeStates[i]){
    }
    
    this.dPos[i] = [0, 0, 0];
    this.dRot[i] = 0;
    this.dScl[i] = [0, 0, 0];
  }
};
nJSE.components.transform.heirarchalFunction = function (index, parentID) {
  let pIndex = parentID !== null ? this.indexOf(parentID) : -1, pPos = pIndex !== -1 ? this.pos[pIndex] : [0, 0, 0], pDPos = pIndex !== -1 ? this.dPos[pIndex] : [0, 0, 0], pDRot = pIndex !== -1 ? this.dRot[pIndex] : 0, pDScl = pIndex !== -1 ? this.dScl[pIndex] : [0, 0, 0], pToC = [this.pos[index][0] - pPos[0], this.pos[index][1] - pPos[1], 0], cPos = this.pos[index], cDPos = this.dPos[index], cDScl = this.dScl[index];
  
  let vPos = [pDPos[0], pDPos[1], pDPos[2]],
      vRot = pDRot !== 0 ? [(-pPos[0] + cPos[0])*Math.cos(pDRot) - (-pPos[1] + cPos[1])*Math.sin(pDRot) + pPos[0] - cPos[0],
              (-pPos[1] + cPos[1])*Math.cos(pDRot) + (-pPos[0] + cPos[0])*Math.sin(pDRot) + pPos[1] - cPos[1], 0] : [0, 0, 0],
      vScl = [pToC[0] * pDScl[0], pToC[1] * pDScl[1], pToC[2] * pDScl[2]];
  
  this.dPos[index] = [cDPos[0] + vPos[0] + vRot[0] + vScl[0], cDPos[1] + vPos[1] + vRot[1] + vScl[1], cDPos[2] + vPos[2] + vScl[2]];
  this.dRot[index] += pDRot;
  this.dScl[index] = [cDScl[0] + pDScl[0], cDScl[1] + pDScl[1], cDScl[2] + pDScl[2]];
  
  this.pos[index] = [this.dPos[index][0] + this.pos[index][0], this.dPos[index][1] + this.pos[index][1], this.dPos[index][2] + this.pos[index][2]];
  this.rot[index] += this.dRot[index];
  this.scl[index] = [this.dScl[index][0] + this.scl[index][0], this.dScl[index][1] + this.scl[index][1], this.dScl[index][2] + this.scl[index][2]];
  
  this.matrix[index] = this.getMatrix(index);
};
nJSE.components.transform.getMatrix = function(index){
  let posMatrix = [1, 0, this.pos[index][0], 0, 1, this.pos[index][1]], 
      rotMatrix = this.rot[index] !== 0 ? [Math.cos(this.rot[index]), -Math.sin(this.rot[index]), 0, Math.sin(this.rot[index]), Math.cos(this.rot[index]), 0] : [1, 0, 0, 0, 1, 0],
      sclMatrix = [this.scl[index][0], 0, 0, 0, this.scl[index][1], 0];
  
  return this.mulMatrices(posMatrix, rotMatrix, sclMatrix);
};
nJSE.components.transform.mulMatrices = function(){
  let m = [1, 0, 0, 0, 1, 0];
  var i = arguments.length;
  
  while(i--){
    let nM = arguments[i];
    
    m = [nM[0] * m[0] + nM[1] * m[3], nM[0] * m[1] + nM[1] * m[4], nM[0] * m[2] + nM[1] * m[5] + nM[2],
        nM[3] * m[0] + nM[4] * m[3], nM[3] * m[1] + nM[4] * m[4], nM[3] * m[2] + nM[4] * m[5] + nM[5]];
  }
  
  return m;
};
nJSE.components.transform.invMatrix = function(m){
  let d = 1/(m[0]*m[4]-m[1]*m[3]);
  
  return [d*m[4], d*-m[1], d*(m[1]*m[5] - m[2]*m[4]), d*-m[3], d*m[0], d*-(m[0]*m[5]-m[2]*m[3])];
}
nJSE.components.transform.matrixByVector = function(m, v){
  return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], v[2]];
};