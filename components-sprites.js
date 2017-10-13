//SPRITES COMPONENT
nJSE.components.sprites = nJSE.components.base();
nJSE.components.sprites.onInit = function () {
  this.images = [];
  this.frames = [];
  this.layers = [];
  this.speeds = [];
  this.transformIndices = [];

  this.defaultLayer = nJSE.renderer.getCanvas(50).getContext('2d');
};
nJSE.components.sprites.onCreate = function (id) {
  let index = this.entityIDs.length - 1;

  this.images[index] = [nJSE.assets.imageCanvases[1]];
  this.frames[index] = 0;
  this.layers[index] = this.defaultLayer;
  this.speeds[index] = 0; // FPS
  this.transformIndices[index] = nJSE.components.transform.indexOf(id, true);
};
nJSE.components.sprites.onUpdate = function (deltaTime) {
  var i = this.entityIDs.length;

  while (i--)
    if (this.speeds[i] > 0)
      this.frames[i] = (this.frames[i] + deltaTime * this.speeds[i]) % this.images[i].length;
};
nJSE.components.sprites.onDraw = function () {
  var i = this.entityIDs.length;

  while (i--) {
    let pos = nJSE.components.transform.positions[this.transformIndices[i]];
    let rotation = nJSE.components.transform.rotations[this.transformIndices[i]];
    let scale = nJSE.components.transform.scales[this.transformIndices[i]];

    let ctx = this.layers[i];
    let image = this.images[i][this.frames[i] << 0];

    //ctx.scale(Math.round(scale.x), Math.round(scale.y));
    ctx.setTransform(scale.x, 0, 0, scale.y, pos.x, pos.y);
    ctx.rotate(rotation);

    this.layers[i].drawImage(nJSE.assets.imageCanvases[1], -image.width * 0.5, -image.height * 0.5);
  }
};
nJSE.components.sprites.setImages = function (index, images) {
  this.images[index] = images;
};