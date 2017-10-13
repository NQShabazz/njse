'use strict';

//it would be best to initialize arrays as new Array(10000000) or so
//HEIRARCHY COMPONENT
nJSE.components.heirarchy = nJSE.components.base();
nJSE.components.heirarchy.onInit = function () {
  this.ranks = [];
  this.parents = [];
  this.children = [];
};
nJSE.components.heirarchy.onCreate = function (id) {
  let index = this.entityIDs.length - 1;

  this.ranks[index] = 0;
  this.parents[index] = null;
  this.children[index] = [];
};
nJSE.components.heirarchy.parentByID = function (childID, parentID) {
  let parentIndex = this.indexOf(parentID),
    childIndex = this.indexOf(childID);

  this.parentByIndex(parentIndex, childIndex);
};
nJSE.components.heirarchy.parentByIndex = function (childIndex, parentIndex) {
  if (parentIndex === -1 || childIndex === -1)
    return;

  this.setParent(childIndex, parentIndex);
};
nJSE.components.heirarchy.unparentByID = function (id) {
  let index = this.indexOf(id);

  this.unparentByIndex(index);
}
nJSE.components.heirarchy.unparentByIndex = function (index) {
  if (index === -1)
    return;

  this.setParent(index, undefined);
}
nJSE.components.heirarchy.setParent = function (childIndex, parentIndex) {

  if (this.parents[childIndex]) {
    let pIndex = this.parents[childIndex];

    if (pIndex !== undefined)
      this.children[pIndex].splice(this.children[pIndex].indexOf(childIndex), 1);
  }

  this.parents[childIndex] = parentIndex;

  if (parentIndex !== undefined) {
    if (this.children[parentIndex].indexOf(childIndex) === -1)
      this.children[parentIndex][this.children[parentIndex].length] = childIndex;

    this.setRank(childIndex, this.ranks[parentIndex] + 1);
  } else
    this.setRank(childIndex, 0);
}
nJSE.components.heirarchy.setRank = function (index, rank) {
  if (index === -1)
    return;

  var i = this.children[index].length;

  while (i--)
    this.setRank(this.children[index][i], rank + 1);

  this.ranks[index] = rank;
}
nJSE.components.heirarchy.orderedIteration = function (heirarchyIndexArray, heirarchalFunction) {
  var currentRank = 0,
    highestRank = 0;

  while (currentRank !== highestRank + 1) {
    var i = heirarchyIndexArray.length;

    while (i--) {
      if (heirarchyIndexArray[i] !== undefined) {
        let rank = this.ranks[heirarchyIndexArray[i]];

        if (rank > highestRank)
          highestRank = rank;



        if (rank === currentRank)
          heirarchalFunction(i, this.entityIDs[this.parents[heirarchyIndexArray[i]]]);
      }
    }

    currentRank++;
  }
}

//TAG COMPONENT
nJSE.components.tags = nJSE.components.base();
nJSE.components.tags.onInit = function (id) {
  this.strings = [];
};
nJSE.components.tags.onCreate = function (id) {
  this.strings[this.strings.length] = [];
};
nJSE.components.tags.addTags = function (index, tagArray) {
  let length = this.strings[index].length;
  var i = tagArray.length

  while (i--)
    this.strings[index][length + i] = tagArray[i];
};
nJSE.components.tags.removeTags = function (index, tagArray) {
  var i = tagArray.length;

  while (i--)
    while (this.strings[index].indexOf(tagArray[i]) !== -1)
      this.strings.splice(this.strings[index].indexOf(tagArray[i]), 1);
};

//TRANSFORM COMPONENT
nJSE.components.transform = nJSE.components.base();
nJSE.components.transform.onInit = function () {
  this.scales = [];
  this.rotations = [];
  this.positions = [];
  this.bufferScales = [];
  this.bufferRotations = [];
  this.bufferPositions = [];
  this.heirarchyIndices = [];
  this.factorScale = [];
  this.factorRotation = [];
  this.factorPosition = [];
  this.factorPositionOffset = [];
  this.factorScaleOffset = [];
  this.factorRotationOffset = [];
};
nJSE.components.transform.onCreate = function (id) {
  let index = this.entityIDs.length - 1;

  this.scales[index] = new Vector(1, 1);
  this.rotations[index] = 0;
  this.positions[index] = new Vector(0, 0);
  this.bufferScales[index] = Vector.zero;
  this.bufferRotations[index] = 0;
  this.bufferPositions[index] = Vector.zero;
  this.heirarchyIndices[index] = nJSE.components.heirarchy.indexOf(id, true);

  this.factorScale[index] = true;
  this.factorRotation[index] = true
  this.factorPosition[index] = true
  this.factorPositionOffset[index] = true
  this.factorScaleOffset[index] = true
  this.factorRotationOffset[index] = true
};
nJSE.components.transform.onEarlyUpdate = function (deltaTime) {
  nJSE.components.heirarchy.orderedIteration(this.heirarchyIndices, this.heirarchalFunction);

  var i = this.entityIDs.length;

  while (i--) {
    this.bufferScales[i].setTo(0, 0);
    this.bufferRotations[i] = 0;
    this.bufferPositions[i].setTo(0, 0);
  }
};
nJSE.components.transform.heirarchalFunction = function (index, parentID) {
  if (parentID !== null) {
    let parentIndex = this.indexOf(parentID);

    if (parentIndex !== -1) {

      if (this.factorScale[index])
        this.bufferScales[index].add(this.bufferScales[parentIndex]);

      if (this.factorRotation)
        this.bufferRotations[index] += this.bufferRotations[parentIndex];

      if (this.factorPosition[index]) {
        let pos = this.positions[index].copy;

        if (this.factorPositionOffset[index])
          pos.add(this.bufferPositions[parentIndex]);

        pos.subtract(this.positions[parentIndex]);

        if (this.factorScaleOffset[index])
          pos.add(pos.times(this.bufferScales[parentIndex]));

        if (this.bufferRotations[parentIndex] !== 0 && this.factorRotationOffset[index]) {
          let cosTheta = Math.cos(this.bufferRotations[parentIndex]);
          let sinTheta = Math.sin(this.bufferRotations[parentIndex]);

          pos.setTo(pos.x * cosTheta - pos.y * sinTheta, pos.x * sinTheta + pos.y * cosTheta);
        }

        this.bufferPositions[index].add(this.positions[parentIndex].plus(pos).subtract(this.positions[index]));
      }
    }
  }

  this.scales[index].add(this.bufferScales[index]);
  this.rotations[index] += this.bufferRotations[index];
  this.positions[index].add(this.bufferPositions[index]);
};