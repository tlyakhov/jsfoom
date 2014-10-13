inherit(AttackBehavior, RocketBehavior);

function RocketBehavior(options) {
    AttackBehavior.call(this, options);

    this.strength = 5.0;
    this.minDistance = null;

    $.extend(true, this, options);
}

classes['RocketBehavior'] = RocketBehavior;

RocketBehavior.editableProperties = AttackBehavior.editableProperties.concat([
    { name: 'strength', friendly: 'Strength', type: 'float' }
]);

RocketBehavior.prototype.attack = function (lastFrameTime, target) {
    if(!AttackBehavior.prototype.attack.call(this, lastFrameTime, target))
        return false;

    return true;
};

RocketBehavior.prototype.serialize = function () {
    var r = AttackBehavior.prototype.serialize.call(this);

    r.strength = this.strength;

    return r;
};

RocketBehavior.deserialize = function (data, entity, behavior) {
    behavior = AttackBehavior.deserialize(data, entity, behavior);

    behavior.strength = data.strength;

    return behavior;
};