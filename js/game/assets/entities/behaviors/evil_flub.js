'use strict';

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
        var pe = new SpriteEntity({
            width: 12,
            height: 12,
            boundingRadius: 6,
            sprites: [
                new Sprite({ textureSrc: 'data/game/transparent-bubble.png'})
            ],
            behaviors: [ new ProjectileBehavior({ entityClasses: [ 'Player', 'GameEntityFlub' ] }) ],
            collisionResponseCallback: 'return this.getBehavior(ProjectileBehavior).onCollision();'
        });

        behaviors.push(new WanderBehavior({ speed: 0.1, facing: false, moveZ: false, entity: this.entity }));
        behaviors.push(new RocketBehavior({ entity: this.entity,
            speed: 2,
            entityClasses: [ 'Player', 'GameEntityFlub' ],
            projectileEntity: pe }));
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