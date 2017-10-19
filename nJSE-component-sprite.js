//sprite COMPONENT
nJSE.components.sprite = nJSE.components.base();

nJSE.components.sprite.onInit = function () {
  this.srcPrefix = "";
  this.imageCanvases = [];

  this.images = [];
  this.frames = [];
  this.layers = [];
  this.speeds = [];
  this.transformIndices = [];

  this.defaultLayer = nJSE.renderer.getCanvas(50).getContext('2d');
};
nJSE.components.sprite.onCreate = function (id) {
  let index = this.entityIDs.length - 1;

  this.images[index] = index === 0 ? [this.imageCanvases[6],this.imageCanvases[7],this.imageCanvases[8]] : [this.imageCanvases[1]];
  this.frames[index] = 0;
  this.layers[index] = this.defaultLayer;
  this.speeds[index] = 1; // FPS
  this.transformIndices[index] = nJSE.components.transform.indexOf(id, 1);
};
nJSE.components.sprite.onUpdate = function (deltaTime) {
  var i = this.entityIDs.length;

  while (i--)
    if (this.activeStates[i] && this.speeds[i] > 0)
      this.frames[i] = (this.frames[i] + deltaTime * this.speeds[i]) % this.images[i].length;
};
nJSE.components.sprite.onDraw = function () {
  var i = this.entityIDs.length;

  while (i--) {
    if(!this.activeStates[i])
      continue;
    
    let pos = nJSE.components.transform.positions[this.transformIndices[i]];
    let rotation = nJSE.components.transform.rotations[this.transformIndices[i]];
    let scale = nJSE.components.transform.scales[this.transformIndices[i]];

    let ctx = this.layers[i];
    let image = this.images[i][this.frames[i] << 0];

    //ctx.scale(Math.round(scale.x), Math.round(scale.y));
    ctx.setTransform(scale.x, 0, 0, scale.y, pos.x, pos.y);
    ctx.rotate(rotation);

    this.layers[i].drawImage(image, -image.width * 0.5, -image.height * 0.5);
  }
};
nJSE.components.sprite.addImage = function (src) {
  let len = this.imageCanvases.length,
    img = new Image();

  this.imageCanvases[len] = document.createElement('canvas');

  img.index = len;
  img.src = this.srcPrefix + src;
  img.onload = function () {
    let canvas = nJSE.components.sprite.imageCanvases[img.index];

    canvas.width = img.width;
    canvas.height = img.height;

    canvas.getContext('2d').drawImage(img, 0, 0);
  };
};
nJSE.components.sprite.setImages = function (index, images) {
  this.images[index] = images;
};