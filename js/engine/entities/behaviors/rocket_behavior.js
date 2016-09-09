'use strict';

inherit(AttackBehavior, RocketBehavior);

function RocketBehavior(options) {
    AttackBehavior.call(this, options);

    this.speed = 5.0;
    this.minDistance = null;
    this.projectileEntity = null;
    $.extend(true, this, options);
}

classes['RocketBehavior'] = RocketBehavior;

RocketBehavior.editableProperties = AttackBehavior.editableProperties.concat([
    { name: 'speed', friendly: 'Speed', type: 'float' },
    { name: 'projectileEntity', friendly: 'Projectile Entity', type: 'object', childType: 'Entity' }
]);

RocketBehavior.prototype.attack = function (lastFrameTime, target) {
    if(!AttackBehavior.prototype.attack.call(this, lastFrameTime, target))
        return false;

    if(!this.projectileEntity)
        return true;

    var p = this.projectileEntity.constructor.deserialize(this.projectileEntity.serialize(), this.entity.map);
    p.pos = vec3clone(this.entity.pos);
    if(this.entity.height != undefined) {
        p.pos[2] += this.entity.height / 2;
        if(p.height != undefined)
            p.pos[2] -= p.height / 2;
    }

    vec3sub(target.pos, this.entity.pos, p.vel);
    vec3mul(vec3normalize(p.vel, p.vel), this.speed, p.vel);

    this.entity.sector.entities.push(p);
    return true;
};

RocketBehavior.prototype.serialize = function () {
    var r = AttackBehavior.prototype.serialize.call(this);

    r.speed = this.speed;

    return r;
};

RocketBehavior.deserialize = function (data, entity, behavior) {
    behavior = AttackBehavior.deserialize(data, entity, behavior);

    behavior.speed = data.speed;

    return behavior;
};