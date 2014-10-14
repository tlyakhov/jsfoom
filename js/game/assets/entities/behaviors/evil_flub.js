inherit(Behavior, GameBehaviorEvilFlub);

function GameBehaviorEvilFlub(options) {
    Behavior.call(this, options);

    $.extend(true, this, options);
}

GameBehaviorEvilFlub.editableProperties = Behavior.editableProperties.concat([]);

classes['GameBehaviorEvilFlub'] = GameBehaviorEvilFlub;

GameBehaviorEvilFlub.prototype.frame = function (lastFrameTime) {
    Behavior.prototype.frame.call(this, lastFrameTime);

    if (!this.entity)
        return;

    var behaviors = this.entity.behaviors;

    if (behaviors.length == 1) {
        behaviors.push(new WanderBehavior({ speed: 0.1, facing: false, moveZ: false, entity: this.entity }));
        behaviors.push(new RifleBehavior({ entity: this.entity }));
    }
};

GameBehaviorEvilFlub.prototype.serialize = function () {
    var r = Behavior.prototype.serialize.call(this);

    return r;
};

GameBehaviorEvilFlub.deserialize = function (data, entity, behavior) {
    behavior = Behavior.deserialize(data, entity, behavior);

    return behavior;
};