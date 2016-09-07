function AudioEngine(options) {
    this.sounds = {};
    this.onAllLoaded = [];

    if(options)
        $.extend(true, this, options);

    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContext();
}

var audioEngine = new AudioEngine();

AudioEngine.prototype.get = function(url) {
    if(!this.sounds[url]) {
        var sound = new AudioEngineSound({ url: url });

        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        request.onload = function () { sound._onLoaded(request); };
        request.send();

        this.sounds[url] = sound;
    }

    return this.sounds[url];
};

AudioEngine.prototype.onSoundLoaded = function(sound) {
    var loadedCount = 0;

    for(var url in this.sounds) {
        if(this.sounds[url].loaded)
            loadedCount++;
    }

    if(loadedCount == Object.keys(this.sounds)) {
        for(var i = 0; i < this.onAllLoaded.length; i++) {
            this.onAllLoaded[i]();
        }
    }
};

AudioEngine.prototype.listener = function(entity) {
    this.context.listener.setPosition(
            entity.pos[0] / GAME_CONSTANTS.audioUnitsFactor,
            entity.pos[1] / GAME_CONSTANTS.audioUnitsFactor,
            entity.pos[2] / GAME_CONSTANTS.audioUnitsFactor);
    this.context.listener.setOrientation(
        -Math.cos(entity.angle * Math.PI / 180.0),
        -Math.sin(entity.angle * Math.PI / 180.0),
        0, 0, 0, 1.0);
};