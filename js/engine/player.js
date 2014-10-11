inherit(Entity, Player);

function Player(options) {
    Entity.call(this, options);

    this.height = GAME_CONSTANTS.playerHeight;
    this.boundingRadius = GAME_CONSTANTS.playerBoundingRadius;
    this.standing = true;
    this.crouching = false;
    this.inventory = [];

    $.extend(true, this, options);
}

classes['Player'] = Player;

Player.editorHidden = true;
Player.editableProperties = Entity.editableProperties;

Player.prototype.frame = function (lastFrameTime) {
    Entity.prototype.frame.call(this, lastFrameTime);

    if (!this.sector)
        return;

    if (this.vel[2] <= 0 && this.vel[2] >= -0.001)
        this.standing = true;
    else
        this.standing = false;

    if (this.crouching) {
        this.height = GAME_CONSTANTS.playerCrouchHeight;
    }
    else {
        this.height = GAME_CONSTANTS.playerHeight;
    }

    if (this.hurtTime > 0) {
        globalGame.frameTint = 255 | ((fast_floor(this.hurtTime * 200 / GAME_CONSTANTS.playerHurtTime) & 0xFF) << 24);
        this.hurtTime--;
    }
};

Player.prototype.hurt = function (amount) {
    Entity.prototype.hurt.call(this, amount);

    this.hurtTime = GAME_CONSTANTS.playerHurtTime;
};

Player.prototype.move = function (angle, lastFrameTime) {
    this.vel[0] += Math.cos(angle * deg2rad) * GAME_CONSTANTS.playerSpeed;
    this.vel[1] += Math.sin(angle * deg2rad) * GAME_CONSTANTS.playerSpeed;
};

Player.prototype.serialize = function () {
    var r = Entity.prototype.serialize.call(this);

    r.standing = this.standing;
    r.crouching = this.crouching;
    r.height = this.height;

    return r;
};

Player.deserialize = function (data, map, entity) {
    var player = Entity.deserialize(data, map, entity);

    player.standing = data.standing;
    player.crouching = data.crouching;
    player.height = data.height;

    return player;
};