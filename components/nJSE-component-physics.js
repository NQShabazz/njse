'use strict';

//physics COMPONENT
nJSE.components.physics = nJSE.components.base();
nJSE.components.physics.onInit = function () {
  this.pi1Over4 = Math.PI * 0.25;
  this.pi3Over4 = Math.PI * 0.75;
  this.pi5Over4 = Math.PI * 1.25;
  this.pi7Over4 = Math.PI * 1.75;
  
  this.gravity = [0.01, 0.005];
  
  this.kin = [];
  this.accel = [];
  this.vel = [];
  this.transformIndices = [];
  this.colliderIndices = [];
};
nJSE.components.physics.onCreate = function (id) {
  let index = this.entityIDs.length - 1;
  
  this.kin[index] = 1;
  this.accel[index] = [0, 0];
  this.vel[index] = [0, 0];

  this.transformIndices[index] = nJSE.components.transform.indexOf(id, 1);
  this.colliderIndices[index] = nJSE.components.collider.indexOf(id, 1);
};
nJSE.components.physics.onUpdate = function (deltaTime) {
  var i = this.entityIDs.length;

  while (i--) {
    if(!this.activeStates[i])
      continue;
    
    this.vel[i] = [this.vel[i][0] + this.accel[i][0], this.vel[i][1] + this.accel[i][1]];
    this.accel[i] = [0, 0];
    
    if(this.kin[i]){
      let collisions = nJSE.components.collider.collisions0[this.colliderIndices[i]];
      var j = collisions.length;
      
      while(j--){
        let cIndex = this.indexOf(collisions[j][0]), angle = collisions[j][1];

        if(cIndex > -1){
          if(angle > this.pi1Over4 && angle < this.pi3Over4)
            this.vel[i] = [this.vel[i][0], Math.min(0, this.vel[i][1])];
          else if(angle > this.pi3Over4 && angle < this.pi5Over4)
            this.vel[i] = [Math.max(0, this.vel[i][0]), this.vel[i][1]];
          else if(angle > this.pi5Over4 && angle < this.pi7Over4)
            this.vel[i] = [this.vel[i][0], Math.max(0, this.vel[i][1])];
          else
            this.vel[i] = [Math.min(0, this.vel[i][0]), this.vel[i][1]];
        }
      }

      nJSE.components.transform.translate(this.transformIndices[i], this.vel[i]);
      
      this.accel[i] = this.gravity;
    }
  }
};