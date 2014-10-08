inherit(SpriteEntity, GameEntityFlub);

var globalGameEntityFlubSprites = {
    0: new Sprite({ textureSrc: '/data/game/flub-back.png', angleIndex: 0 }),
    1: new Sprite({ textureSrc: '/data/game/flub-back-right.png', angleIndex: 1 }),
    2: new Sprite({ textureSrc: '/data/game/flub-right.png', angleIndex: 2 }),
    3: new Sprite({ textureSrc: '/data/game/flub-front-right.png', angleIndex: 3 }),
    4: new Sprite({ textureSrc: '/data/game/flub-front.png', angleIndex: 4 }),
    5: new Sprite({ textureSrc: '/data/game/flub-front-left.png', angleIndex: 5 }),
    6: new Sprite({ textureSrc: '/data/game/flub-left.png', angleIndex: 6 }),
    7: new Sprite({ textureSrc: '/data/game/flub-back-left.png', angleIndex: 7 })
};

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