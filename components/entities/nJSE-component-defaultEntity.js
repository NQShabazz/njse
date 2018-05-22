//BASIC ENTITY COMPONENT
nJSE.components.baseEntity = nJSE.components.base();
nJSE.components.baseEntity.onInit = function () {
  this.tagIndices = [];
  this.heirarchyIndices = [];
  this.transformIndices = [];
};
nJSE.components.baseEntity.onCreate = function (id) {
  let index = this.entityIDs.length - 1;
  
  this.tagIndices[index] = nJSE.components.tag.indexOf(id, 1);
  this.heirarchyIndices[index] = nJSE.components.heirarchy.indexOf(id, 1);
  this.transformIndices[index] = nJSE.components.transform.indexOf(id, 1);
};

//BASIC ENTITY COMPONENT
nJSE.components.defaultEntity = nJSE.components.base();
nJSE.components.defaultEntity.onInit = function () {
  this.tagIndices = [];
  this.heirarchyIndices = [];
  this.transformIndices = [];
  this.spriteIndices = [];
  this.audioIndices = [];
  this.colliderIndices = [];
  this.physicsIndices = [];
};
nJSE.components.defaultEntity.onCreate = function (id) {
  let index = this.entityIDs.length - 1;
  
  this.tagIndices[index] = nJSE.components.tag.indexOf(id, 1);
  this.heirarchyIndices[index] = nJSE.components.heirarchy.indexOf(id, 1);
  this.transformIndices[index] = nJSE.components.transform.indexOf(id, 1);
  this.spriteIndices[index] = nJSE.components.sprite.indexOf(id, 1);
  this.audioIndices[index] = nJSE.components.audio.indexOf(id, 1);
  this.colliderIndices[index] = nJSE.components.collider.indexOf(id, 1);
  this.physicsIndices[index] = nJSE.components.physics.indexOf(id, 1);
  
  nJSE.components.collider.setShape(this.colliderIndices[index], 35, 4, Math.PI*0.25);
};

//BASIC ENTITY COMPONENT
nJSE.components.wallEntity = nJSE.components.base();
nJSE.components.wallEntity.onInit = function () {
  this.tagIndices = [];
  this.heirarchyIndices = [];
  this.transformIndices = [];
  this.spriteIndices = [];
  this.audioIndices = [];
  this.colliderIndices = [];
  this.physicsIndices = [];
};
nJSE.components.wallEntity.onCreate = function (id) {
  let index = this.entityIDs.length - 1;
  
  this.tagIndices[index] = nJSE.components.tag.indexOf(id, 1);
  this.heirarchyIndices[index] = nJSE.components.heirarchy.indexOf(id, 1);
  this.transformIndices[index] = nJSE.components.transform.indexOf(id, 1);
  this.spriteIndices[index] = nJSE.components.sprite.indexOf(id, 1);
  this.audioIndices[index] = nJSE.components.audio.indexOf(id, 1);
  this.colliderIndices[index] = nJSE.components.collider.indexOf(id, 1);
  this.physicsIndices[index] = nJSE.components.physics.indexOf(id, 1);
  
  nJSE.components.collider.setShape(this.colliderIndices[index], 35, 4, Math.PI*0.25);
  nJSE.components.physics.kin[this.physicsIndices[index]] = 0;
};