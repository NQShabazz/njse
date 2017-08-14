'use strict';

//Nazaire's JavaScript Engine (nJSE)
var nJSE = nJSE || {};

nJSE.entities = nJSE.entities || {};

nJSE.entities.entity = function(){
    let id = +(Date.now() + "" + ((Math.random()*1000)|0));
    
    nJSE.components.tags.create(id);
    nJSE.components.heirarchy.create(id);
    nJSE.components.transform.create(id);
    
    return id;
};

nJSE.entities.default = function(){
    let id = nJSE.entities.entity();
    
    nJSE.components.sprites.create(id);
    nJSE.components.physics.create(id);
    
    return id;
};