'use strict';

//Nazaire's JavaScript Engine (nJSE)
var nJSE = nJSE || {};

nJSE.entities = nJSE.entities || {};

nJSE.entities.entity = function () {
  let id = +("" + Date.now() + ((Math.random() * 1000) | 0));

  nJSE.components.tags.create(id);
  nJSE.components.heirarchy.create(id);
  nJSE.components.transform.create(id);

  return id;
};

nJSE.entities.default = function () {
  let id = nJSE.entities.entity();

  nJSE.components.sprite.create(id);
  nJSE.components.collider.create(id);
  nJSE.components.collider.setShape(nJSE.components.collider.entityIDs.length - 1, 35, 4, Math.PI / 4);
  nJSE.components.audio.create(id);
  
  let soundComponentIndex = nJSE.components.audio.entityIDs.length - 1;
  
  nJSE.components.audio.setAudio(soundComponentIndex, 0, 3, 0.5, 1);

  return id;
};