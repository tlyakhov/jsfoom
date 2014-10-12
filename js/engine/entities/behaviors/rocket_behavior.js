inherit(InteractionBehavior, RocketBehavior);

function RocketBehavior(options) {
    InteractionBehavior.call(this, options);

    this.strength = 5.0;
    this.minDistance = null;

    $.extend(true, this, options);
}

classes['RocketBehavior'] = RocketBehavior;

RocketBehavior.editableProperties = InteractionBehavior.editableProperties.concat([
    { name: 'strength', friendly: 'Strength', type: 'float' }
]);

RocketBehavior.prototype.frame = function(lastFrameTime) {
    InteractionBehavior.prototype.frame.call(this, lastFrameTime);
};

RocketBehavior.prototype.interact = function (lastFrameTime, target) {
    InteractionBehavior.prototype.interact.call(this, lastFrameTime, target);
};

RocketBehavior.prototype.serialize = function () {
    var r = InteractionBehavior.prototype.serialize.call(this);

    r.strength = this.strength;

    return r;
};

RocketBehavior.deserialize = function (data, entity, behavior) {
    behavior = InteractionBehavior.deserialize(data, entity, behavior);

    behavior.strength = data.strength;

    return behavior;
};