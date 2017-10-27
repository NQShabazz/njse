//sprite COMPONENT
nJSE.components.audio = nJSE.components.base();
nJSE.components.audio.onInit = function () {
  this.audioNodes = [];
  
  this.audios = [];
};
nJSE.components.audio.onCreate = function (id) {
  let index = this.entityIDs.length - 1;

  this.audios[index] = [];
};
nJSE.components.audio.onDelete = function (index) {
  var i = this.audios[index].length;
  
  while(i--)
    this.pauseaudio(index, i);
};
nJSE.components.audio.addAudio = function(src){
  this.audioNodes.push(new Audio(src));
}
nJSE.components.audio.setAudio = function(index, nodeIndex, numInstances, volume, loop){
  let len = this.audios[index].length;
  
  var i = this.audios[index].length;
  
  while(i--)
    if(this.audios[index][i][0].src === this.audioNodes[nodeIndex].src)
      return i;
  
  i = numInstances || 1;

  this.audios[index][len] = [];

  while(i--){
    let a = this.audioNodes[nodeIndex].cloneNode();
    
    a.volume = volume || 0.5;
    a.loop = loop || 0;
    
    this.audios[index][len][i] = a;
  }
  
  return len;
};
nJSE.components.audio.playAudio = function(index, audioIndex, instanceIndex){
  if(instanceIndex !== undefined){
    this.audios[index][audioIndex][instanceIndex].play();
  }else{
    var i = this.audios[index][audioIndex].length - 1;

    while(i > 0 && !this.audios[index][audioIndex][i].paused)
      i--;

    this.audios[index][audioIndex][i].play();
  }
};
nJSE.components.audio.pauseAudio = function(index, audioIndex, instanceIndex){
  if(instanceIndex !== undefined){
    this.audios[index][audioIndex][instanceIndex].pause();
  }else{
    var i = this.audios[index][audioIndex].length;

    while(i--)
      this.audios[index][audioIndex][i].pause();
  }
};
nJSE.components.audio.stopAudio = function(index, audioIndex, instanceIndex){
  if(instanceIndex !== undefined){
    this.audios[index][audioIndex][instanceIndex].pause();
    this.audios[index][audioIndex][instanceIndex].currentTime = 0;
    this.audios[index][audioIndex][instanceIndex].load();
  }else{
    var i = this.audios[index][audioIndex].length;

    while(i--){
      this.audios[index][audioIndex][i].pause();
      this.audios[index][audioIndex][i].currentTime = 0;
      this.audios[index][audioIndex][i].load();
    }
  }
};
nJSE.components.audio.resetaudio = function(index, audioIndex, instanceIndex){
  if(instanceIndex !== undefined){
    this.audios[index][audioIndex][instanceIndex].currentTime = 0;
    this.audios[index][audioIndex][instanceIndex].load();
  }else{
    var i = this.audios[index][audioIndex].length;

    while(i--){
      this.audios[index][audioIndex][i].currentTime = 0;
      this.audios[index][audioIndex][i].load();
    }
  }
};
nJSE.components.audio.setVolume = function(volume, index, audioIndex, instanceIndex){
  if(instanceIndex !== undefined){
    this.audios[index][audioIndex][instanceIndex].volume = volume;
  }else{
    var i = this.audios[index][audioIndex].length;

    while(i--)
      this.audios[index][audioIndex][i].volume = volume;
  }
};
nJSE.components.audio.setLoop = function(loop, index, audioIndex, instanceIndex){
  if(instanceIndex !== undefined){
    this.audios[index][audioIndex][instanceIndex].loop = loop;
    this.audios[index][audioIndex][instanceIndex].load();
  }else{
    var i = this.audios[index][audioIndex].length;

    while(i--){
      this.audios[index][audioIndex][i].loop = loop;
      this.audios[index][audioIndex][i].load();
    }
  }
};