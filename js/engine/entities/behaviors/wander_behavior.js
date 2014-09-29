function WanderBehavior(options) {
    Behavior.call(this, options);

    this.target = null;
    this.speed = 0.3;
    this.wanderZ = false;

    $.extend(true, this, options);
}

WanderBehavior.editableProperties = {};

classes['WanderBehavior'] = WanderBehavior;

WanderBehavior.prototype.frame = function (lastFrameTime) {
    Behavior.prototype.frame.call(this, lastFrameTime);

    var entity = this.entity;
    var map = this.entity.map;

    if (!entity.sector)
        return;

    if (!this.wanderZ && this.target)
        this.target[2] = entity.pos[2];

    if (!this.target || vec3dist2(entity.pos, this.target) < sqr(entity.boundingRadius)) {
        this.target = vec3create(0, 0, entity.sector.bottomZ);
        do
        {
            this.target[0] = entity.sector.min[0] + Math.random() * (entity.sector.max[0] - entity.sector.min[0]);
            this.target[1] = entity.sector.min[1] + Math.random() * (entity.sector.max[1] - entity.sector.min[1]);
        }
        while (!entity.sector.isPointInside(this.target[0], this.target[1]))
    }

    var tempvec = vec3blank(true);
    vec3sub(this.target, entity.pos, tempvec);
    vec3normalize(tempvec, tempvec);
    vec3mul(tempvec, this.speed, tempvec);
    vec3add(entity.vel, tempvec, entity.vel);
    vec3mul(entity.vel, 0.5, entity.vel);
    entity.angle = entity.angleTo(entity.pos[0] + entity.vel[0], entity.pos[1] + entity.vel[1]);
};

WanderBehavior.prototype.serialize = function () {
    var r = Behavior.prototype.serialize.call(this);

    r.wanderZ = this.wanderZ;
    r.speed = this.speed;

    return r;
};

WanderBehavior.deserialize = function (data, entity, behavior) {
    behavior = Behavior.deserialize(data, entity, behavior);

    behavior.wanderZ = data.wanderZ;
    behavior.speed = data.speed;

    return behavior;
};