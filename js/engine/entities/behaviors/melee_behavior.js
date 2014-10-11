inherit(InteractionBehavior, MeleeBehavior);

function MeleeBehavior(options) {
    InteractionBehavior.call(this, options);

    this.strength = 5.0;

    $.extend(true, this, options);
}

classes['MeleeBehavior'] = MeleeBehavior;

MeleeBehavior.editableProperties = InteractionBehavior.editableProperties.concat([
    { name: 'strength', friendly: 'Strength', type: 'float' }
]);

MeleeBehavior.prototype.frame = function(lastFrameTime) {
    this.minDistance = this.entity.boundingRadius * 1.5;
    InteractionBehavior.prototype.frame.call(this, lastFrameTime);
};

MeleeBehavior.prototype.interact = function (lastFrameTime, target) {
    InteractionBehavior.prototype.interact.call(this, lastFrameTime, target);

    if(target.hurtTime == 0)
        target.hurt(this.strength);
};

MeleeBehavior.prototype.serialize = function () {
    var r = InteractionBehavior.prototype.serialize.call(this);

    r.strength = this.strength;

    return r;
};

MeleeBehavior.deserialize = function (data, entity, behavior) {
    behavior = InteractionBehavior.deserialize(data, entity, behavior);

    behavior.strength = data.strength;

    return behavior;
};