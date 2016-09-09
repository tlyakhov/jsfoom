'use strict';

function AudioEngineSound(options) {
    this.url = 'data/blip1.wav';
    this.loaded = false;
    this.buffer = null;

    if(options)
        $.extend(true, this, options);
}

classes['AudioEngineSound'] = AudioEngineSound;


AudioEngineSound.prototype._onError = function(error) {
    console.log('Audio engine error: ' + error);
    this.loaded = true;
    audioEngine.onSoundLoaded(this);
};

AudioEngineSound.prototype._onDecodeBuffer = function(buffer) {
    if(!buffer)
    {
        this._onError('Error decoding buffer');
        return;
    }

    this.buffer = buffer;
    this.loaded = true;

    audioEngine.onSoundLoaded(this);
};

AudioEngineSound.prototype._onLoaded = function(request) {
    audioEngine.context.decodeAudioData(request.response,
        $.proxy(this._onDecodeBuffer, this),
        $.proxy(this._onError, this));
};

AudioEngineSound.prototype.play = function() {
    if(!this.loaded || !this.buffer)
        return;

    var source = audioEngine.context.createBufferSource();
    source.buffer = this.buffer;
    source.connect(audioEngine.context.destination);
    source.start(0);
    // note: on older systems, may have to use deprecated noteOn(time);
};