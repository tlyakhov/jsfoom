inherit(SpriteEntity, GameEntityPluk);

var globalGameEntityPlukSprites = {
    0: new Sprite({ textureSrc: '/data/game/pluk.png', angleIndex: 0 })
};

function GameEntityPluk(options) {
    SpriteEntity.call(this, options);

    this.width = 15;
    this.height = 15;
    this.boundingRadius = 7.5;
    this.sprites = globalGameEntityPlukSprites;

    this.behaviors.push(new InventoryItemBehavior({ name: 'pluk flower', count: 1, entity: this }));

    $.extend(true, this, options);
}

classes['GameEntityPluk'] = GameEntityPluk;

GameEntityPluk.editableProperties = SpriteEntity.editableProperties;

GameEntityPluk.prototype.frame = function (lastFrameTime) {
    SpriteEntity.prototype.frame.call(this, lastFrameTime);
};

GameEntityPluk.prototype.hurt = function (amount) {
    //SpriteEntity.prototype.hurt.call(this, amount);
};

GameEntityPluk.prototype.canUse = function () {
    var player = this.map.player;

    return player.health < GAME_CONSTANTS.playerMaxHealth;
};

GameEntityPluk.prototype.use = function () {
    var player = this.map.player;

    player.health += 10;
    if (player.health > GAME_CONSTANTS.playerMaxHealth)
        player.health = GAME_CONSTANTS.playerMaxHealth;
};

GameEntityPluk.deserialize = SpriteEntity.deserialize;