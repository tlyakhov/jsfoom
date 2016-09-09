'use strict';

inherit(SpriteEntity, GameEntityFlub);

var globalGameEntityFlubSprites = [
    new Sprite({ textureSrc: '/data/game/flub/flub-back.png', angle: 0, frame: 0 }),
    new Sprite({ textureSrc: '/data/game/flub/flub-back-right.png', angle: 1, frame: 0 }),
    new Sprite({ textureSrc: '/data/game/flub/flub-right.png', angle: 2, frame: 0 }),
    new Sprite({ textureSrc: '/data/game/flub/flub-front-right.png', angle: 3, frame: 0 }),
    new Sprite({ textureSrc: '/data/game/flub/flub-front.png', angle: 4, frame: 0 }),
    new Sprite({ textureSrc: '/data/game/flub/flub-front-left.png', angle: 5, frame: 0 }),
    new Sprite({ textureSrc: '/data/game/flub/flub-left.png', angle: 6, frame: 0 }),
    new Sprite({ textureSrc: '/data/game/flub/flub-back-left.png', angle: 7, frame: 0 })
];

function GameEntityFlub(options) {
    SpriteEntity.call(this, options);

    this.width = 30;
    this.height = 30;
    this.boundingRadius = 15;
    this.sprites = globalGameEntityFlubSprites;
    this.behaviors.push(new GameBehaviorFlub({ entity: this }));

    $.extend(true, this, options);
}

classes['GameEntityFlub'] = GameEntityFlub;

GameEntityFlub.editableProperties = SpriteEntity.editableProperties;

GameEntityFlub.prototype.frame = function (lastFrameTime) {
    SpriteEntity.prototype.frame.call(this, lastFrameTime);
};

GameEntityFlub.prototype.hurt = function (amount) {
    SpriteEntity.prototype.hurt.call(this, amount);
};

GameEntityFlub.deserialize = SpriteEntity.deserialize;