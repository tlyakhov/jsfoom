function WaypointBehavior(options) {
    Behavior.call(this, options);

    this.target = null;
    this.speed = 0.1;
    this.moveZ = false;
    this.facing = true;

    $.extend(true, this, options);

    this.resetPos = this.entity ? this.entity.pos : null;
}

WaypointBehavior.editableProperties = Behavior.editableProperties.concat([
    { name: 'target', friendly: 'Target', type: 'vector' },
    { name: 'speed', friendly: 'Speed', type: 'float' },
    { name: 'moveZ', friendly: 'Move vertically?', type: 'bool' },
    { name: 'facing', friendly: 'Change facing?', type: 'bool' }
]);

classes['WaypointBehavior'] = WaypointBehavior;

WaypointBehavior.prototype.reset = function () {
    this.entity.pos = this.resetPos;
};

WaypointBehavior.prototype.frame = function (lastFrameTime) {
    Behavior.prototype.frame.call(this, lastFrameTime);

    var entity = this.entity;
    var map = this.entity.map;

    if (!entity.sector)
        return;

    if (!this.moveZ && this.target)
        this.target[2] = entity.pos[2];

    var tempvec = vec3blank(true);
    vec3sub(this.target, entity.pos, tempvec);
    vec3normalize(tempvec, tempvec);
    vec3mul(tempvec, this.speed, tempvec);
    vec3add(entity.vel, tempvec, entity.vel);
    vec3mul(entity.vel, 0.5, entity.vel);
    if (this.facing)
        entity.angle = entity.angleTo(entity.pos[0] + entity.vel[0], entity.pos[1] + entity.vel[1]);
};

WaypointBehavior.prototype.serialize = function () {
    var r = Behavior.prototype.serialize.call(this);

    r.moveZ = this.moveZ;
    r.speed = this.speed;
    r.facing = this.facing;
    r.target = this.target;

    return r;
};

WaypointBehavior.deserialize = function (data, entity, behavior) {
    behavior = Behavior.deserialize(data, entity, behavior);

    behavior.moveZ = data.moveZ;
    behavior.speed = data.speed;
    behavior.facing = data.facing;
    behavior.target = data.target;

    return behavior;
};