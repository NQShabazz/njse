'use strict';

//Nazaire's JavaScript Engine
var nJSE = nJSE || {};

nJSE.components = {};

nJSE.components.array = [];

nJSE.components.base = function () {
  let component = {
    entityIDs: [],
    activeStates: [],
    create: function (id) {
      if (this.indexOf(id) === -1) {
        this.entityIDs.push(id);
        this.activeStates.push(1);
        this.onCreate(id);
      }
      
      return this.entityIDs.length;
    },
    delete: function(id){
      let index = this.indexOf(id);
      
      if (index !== -1) {
        this.activeStates[index] = 0;
        this.onDelete(index);
      }
    },
    init: function () {
      this.heirarchalFunction = this.heirarchalFunction.bind(this);
      this.onInit();
    },
    onInit: function () {},
    onCreate: function (id) {},
    onDelete: function (index) {},
    onEarlyUpdate: function (deltaTime) {},
    onUpdate: function (deltaTime) {},
    onLateUpdate: function (deltaTime) {},
    onDraw: function () {},
    heirarchalFunction: function (index, parentID) {},
    indexOf: function (id, required) {
      let index = this.entityIDs.indexOf(id);

      if (required && index < 0) {
        this.create(id);
        return this.entityIDs.length - 1;
      }

      return index;
    }
  };

  nJSE.components.array.push(component);

  return component;
};

nJSE.components.delete = function (id) {
  var i = this.array.length;

  while (i--)
    this.array[i].delete(id);
};

nJSE.components.init = function () {
  var i = this.array.length;

  while (i--)
    this.array[i].init();
};

nJSE.components.update = function (deltaTime) {
  var i = this.array.length,
    j = i,
    k = j;

  while (i--)
    this.array[i].onEarlyUpdate(deltaTime);

  while (j--)
    this.array[j].onUpdate(deltaTime);

  while (k--)
    this.array[k].onLateUpdate(deltaTime);
};

nJSE.components.draw = function () {
  var i = this.array.length;

  while (i--)
    this.array[i].onDraw();
};