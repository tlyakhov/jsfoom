inherit(AttackBehavior, MeleeBehavior);

function MeleeBehavior(options) {
    AttackBehavior.call(this, options);

    this.strength = 5.0;

    $.extend(true, this, options);
}

classes['MeleeBehavior'] = MeleeBehavior;

MeleeBehavior.editableProperties = AttackBehavior.editableProperties.concat([
    { name: 'strength', friendly: 'Strength', type: 'float' }
]);

MeleeBehavior.prototype.frame = function(lastFrameTime) {
    if(!this.active)
        return;
    this.minDistance = this.entity.boundingRadius * 1.5;
    AttackBehavior.prototype.frame.call(this, lastFrameTime);
};

MeleeBehavior.prototype.attack = function (lastFrameTime, target) {
    if(!AttackBehavior.prototype.attack.call(this, lastFrameTime, target))
        return false;

    target.hurt(this.strength);

    return true;
};

MeleeBehavior.prototype.serialize = function () {
    var r = AttackBehavior.prototype.serialize.call(this);

    r.strength = this.strength;

    return r;
};

MeleeBehavior.deserialize = function (data, entity, behavior) {
    behavior = AttackBehavior.deserialize(data, entity, behavior);

    behavior.strength = data.strength;

    return behavior;
};