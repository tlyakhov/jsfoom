inherit(SpriteEntity, GameEntityEvilFlub);

var globalGameEntityEvilFlubSprites = [
    new Sprite({ textureSrc: '/data/game/evil-flub/evil-flub-back.png', angle: 0, frame: 0 }),
    new Sprite({ textureSrc: '/data/game/evil-flub/evil-flub-back-right.png', angle: 1, frame: 0 }),
    new Sprite({ textureSrc: '/data/game/evil-flub/evil-flub-right.png', angle: 2, frame: 0 }),
    new Sprite({ textureSrc: '/data/game/evil-flub/evil-flub-front-right.png', angle: 3, frame: 0 }),
    new Sprite({ textureSrc: '/data/game/evil-flub/evil-flub-front.png', angle: 4, frame: 0 }),
    new Sprite({ textureSrc: '/data/game/evil-flub/evil-flub-front-left.png', angle: 5, frame: 0 }),
    new Sprite({ textureSrc: '/data/game/evil-flub/evil-flub-left.png', angle: 6, frame: 0 }),
    new Sprite({ textureSrc: '/data/game/evil-flub/evil-flub-back-left.png', angle: 7, frame: 0 })
];

function GameEntityEvilFlub(options) {
    SpriteEntity.call(this, options);

    this.width = 30;
    this.height = 30;
    this.boundingRadius = 15;
    this.sprites = globalGameEntityEvilFlubSprites;
    this.behaviors.push(new GameBehaviorEvilFlub({ entity: this }));

    $.extend(true, this, options);
}

classes['GameEntityEvilFlub'] = GameEntityEvilFlub;

GameEntityEvilFlub.editableProperties = SpriteEntity.editableProperties;

GameEntityEvilFlub.prototype.frame = function (lastFrameTime) {
    SpriteEntity.prototype.frame.call(this, lastFrameTime);
};

GameEntityEvilFlub.prototype.hurt = function (amount) {
    SpriteEntity.prototype.hurt.call(this, amount);
};

GameEntityEvilFlub.deserialize = SpriteEntity.deserialize;