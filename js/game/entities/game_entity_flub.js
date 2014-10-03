inherit(SpriteEntity, GameEntityFlub);

var globalGameEntityFlubSprites = {
    0: new Sprite({ textureSrc: '/data/game/flub2.png', angleIndex: 0 }),
    1: new Sprite({ textureSrc: '/data/game/flub1.png', angleIndex: 1 }),
    2: new Sprite({ textureSrc: '/data/game/flub0.png', angleIndex: 2 }),
    3: new Sprite({ textureSrc: '/data/game/flub3.png', angleIndex: 3 })
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