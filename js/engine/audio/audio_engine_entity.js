function AudioEngineEntity(options) {
    if(globalWorkerId != undefined)
        return;

    this.roomImpulse = null;

    this.convolver = audioEngine.context.createConvolver();
    this.convolver.connect(audioEngine.context.destination);
    this.panner = audioEngine.context.createPanner();
    this.panner.connect(this.convolver);
    this.entity = null;

    $.extend(true, this, options);
}

classes['AudioEngineEntity'] = AudioEngineEntity;

AudioEngineEntity.prototype.play = function(sound) {
    if(globalWorkerId != undefined)
        return;

    if(!sound.loaded || !sound.buffer)
        return;

    var entity = this.entity;
    var sector = this.entity.sector;

    var source = audioEngine.context.createBufferSource();
    source.buffer = sound.buffer;
    source.connect(this.panner);

    this.panner.setPosition(entity.pos[0] / GAME_CONSTANTS.audioUnitsFactor,
            entity.pos[1] / GAME_CONSTANTS.audioUnitsFactor,
            entity.pos[2] / GAME_CONSTANTS.audioUnitsFactor);
    if(entity.angle != undefined && entity.angle != null)
        this.panner.setOrientation(-Math.cos(entity.angle * Math.PI / 180.0), -Math.sin(entity.angle * Math.PI / 180.0), 0);
    this.panner.setVelocity(entity.vel[0] / GAME_CONSTANTS.audioUnitsFactor,
            entity.vel[1] / GAME_CONSTANTS.audioUnitsFactor,
            entity.vel[2] / GAME_CONSTANTS.audioUnitsFactor);

    if(sector && sector.roomImpulse && this.roomImpulse != sector.roomImpulse) {
        var impulse = audioEngine.get(sector.roomImpulse);

        if(impulse && impulse.loaded && impulse.buffer) {
            this.convolver.buffer = impulse.buffer;
            this.roomImpulse = sector.roomImpulse;
        }
    }

    source.start(0);
};