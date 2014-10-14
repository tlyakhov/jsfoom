inherit(InteractionBehavior, ProjectileBehavior);

function ProjectileBehavior(options) {
    InteractionBehavior.call(this, options);

    this.strength = 5.0;
    this.mustBeFacing = false;
    this.stopMoving = false;
    this.hitSoundSrc = 'data/sounds/blip1.wav';

    $.extend(true, this, options);
}

classes['ProjectileBehavior'] = ProjectileBehavior;

ProjectileBehavior.editableProperties = InteractionBehavior.editableProperties.concat([
    { name: 'strength', friendly: 'Strength', type: 'float' }
]);

ProjectileBehavior.prototype.frame = function(lastFrameTime) {
    if(!this.active)
        return;
    this.minDistance = this.entity.boundingRadius * 1.5;
    InteractionBehavior.prototype.frame.call(this, lastFrameTime);
};

ProjectileBehavior.prototype.interact = function (lastFrameTime, target) {
    InteractionBehavior.prototype.interact.call(this, lastFrameTime, target);

    var entity = this.entity;
    var map = this.entity.map;

    target.hurt(this.strength);

    if(entity.getBehavior(LightBehavior))
        map.clearLightmaps();

    if(this.hitSoundSrc) {
        var sound = audioEngine.get(this.hitSoundSrc);
        if(entity && entity.audioEngineEntity)
            entity.audioEngineEntity.play(sound);
        else
            sound.play();
    }

    entity.remove();
};

ProjectileBehavior.prototype.serialize = function () {
    var r = InteractionBehavior.prototype.serialize.call(this);

    r.strength = this.strength;
    r.hitSoundSrc = this.hitSoundSrc;

    return r;
};

ProjectileBehavior.deserialize = function (data, entity, behavior) {
    behavior = InteractionBehavior.deserialize(data, entity, behavior);

    behavior.strength = data.strength;
    behavior.hitSoundSrc = data.hitSoundSrc;

    return behavior;
};