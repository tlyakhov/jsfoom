inherit(Entity, Player);

function Player(options) {
    this.parent.constructor.call(this, options);

    this.height = GAME_CONSTANTS.playerHeight;
    this.boundingRadius = GAME_CONSTANTS.playerBoundingRadius;
    this.standing = true;
    this.crouching = false;
    this.renderable = false;

    $.extend(true, this, options);
}

classes['Player'] = Player;

Player.editableProperties = Entity.editableProperties;

Player.prototype.frame = function (lastFrameTime) {
    this.parent.frame.call(this, lastFrameTime);

    if (Math.abs(this.pos[2] - this.sector.bottomZ) < 0.01)
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
    this.parent.hurt.call(this, amount);

    this.hurtTime = GAME_CONSTANTS.playerHurtTime;
};

Player.prototype.move = function (angle, lastFrameTime) {
    this.vel[0] += Math.cos(angle * deg2rad) * GAME_CONSTANTS.playerSpeed;
    this.vel[1] += Math.sin(angle * deg2rad) * GAME_CONSTANTS.playerSpeed;
};

Player.deserialize = function (data, map, entity) {
    var player = Entity.deserialize(data, map, entity);

    return player;
};