'use strict';

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
nJSE.components.heirarchy.onDelete = function (index) {
  var i = this.children[index].length;
  
  while(i--)
    this.unparentByIndex(this.children[index][i]);
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
      this.children[parentIndex].push(childIndex);

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