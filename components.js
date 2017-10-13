'use strict';

//Nazaire's JavaScript Engine
var nJSE = nJSE || {};

nJSE.components = {};

nJSE.components.array = [];

nJSE.components.base = function () {
  let component = {
    entityIDs: [],
    active: [],
    changedIDs: [],
    clearedChanged: true,
    create: function (id) {
      if (this.indexOf(id) === -1) {
        this.entityIDs.push(id);
        this.active.push(true);
        this.onCreate(id);
      }
    },
    init: function () {
      this.heirarchalFunction = this.heirarchalFunction.bind(this);
      this.onInit();
    },
    earlyUpdate: function (deltaTime) {
      if (this.active) {
        this.onEarlyUpdate(deltaTime);
      }
    },
    update: function (deltaTime) {
      if (this.active) {
        this.onUpdate(deltaTime);
      }
    },
    lateUpdate: function (deltaTime) {
      if (this.active) {
        this.onLateUpdate(deltaTime);
      }
    },
    draw: function () {
      if (this.active)
        this.onDraw();
    },
    onInit: function () {},
    onCreate: function (id) {},
    onEarlyUpdate: function (deltaTime) {},
    onUpdate: function (deltaTime) {},
    onLateUpdate: function (deltaTime) {},
    onDraw: function () {},
    heirarchalFunction: function (index, parentID) {},
    indexOf: function (id, required) {
      if (id === undefined)
        return -1;

      let index = this.entityIDs.indexOf(id);

      if (index < 0 && required) {
        this.create(id);
        return this.entityIDs.length - 1;
      }

      return index;
    }
  };

  nJSE.components.array.push(component);

  return component;
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
    this.array[i].earlyUpdate(deltaTime);

  while (j--)
    this.array[j].update(deltaTime);

  while (k--)
    this.array[k].lateUpdate(deltaTime);
};

nJSE.components.draw = function () {
  var i = this.array.length;

  while (i--)
    this.array[i].draw();
};