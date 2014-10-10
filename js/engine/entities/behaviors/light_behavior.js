inherit(Behavior, LightBehavior);

function LightBehavior(options) {
    Behavior.call(this, options);

    this.diffuse = vec3create(1.0, 1.0, 1.0);
    this.strength = 50.0;
    this.attenuation = true;
    this.marked = true;

    this.lastPos = vec3blank();

    $.extend(true, this, options);
}

classes['LightBehavior'] = LightBehavior;

LightBehavior.editableProperties = Behavior.editableProperties.concat([
    { name: 'diffuse', friendly: 'Diffuse', type: 'vector' },
    { name: 'strength', friendly: 'Strength', type: 'float' },
    { name: 'attenuation', friendly: 'Diffuses?', type: 'bool'}
]);


LightBehavior.prototype.frame = function (lastFrameTime) {
    Behavior.prototype.frame.call(this, lastFrameTime);

    var entity = this.entity;
    var map = this.entity.map;

    if (this.lastPos && (entity.pos[0] != this.lastPos[0] || entity.pos[1] != this.lastPos[1] || entity.pos[2] != this.lastPos[2]))
        map.clearLightmaps();

    this.lastPos[0] = entity.pos[0];
    this.lastPos[1] = entity.pos[1];
    this.lastPos[2] = entity.pos[2];
};

LightBehavior.prototype.serialize = function () {
    var r = Behavior.prototype.serialize.call(this);

    r.diffuse = this.diffuse;
    r.strength = this.strength;
    r.attenuation = this.attenuation;

    return r;
};

LightBehavior.deserialize = function (data, entity, behavior) {
    behavior = Behavior.deserialize(data, entity, behavior);

    behavior.diffuse = data.diffuse;
    behavior.strength = data.strength;
    behavior.attenuation = data.attenuation;

    return behavior;
};