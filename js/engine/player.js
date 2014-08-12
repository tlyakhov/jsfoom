Player.prototype = new Entity();
Player.prototype.constructor = Player;
Player.prototype.parent = Entity.prototype;

function Player(options) {
    this.parent.constructor.call(this, options);

    this.height = GAME_CONSTANTS.playerHeight;
    this.standing = true;
    this.crouching = false;

    $.extend(true, this, options);
    this.updateSector();
}

Player.prototype.frame = function (lastFrameTime) {
    this.parent.frame.call(this, lastFrameTime);
    this.updateSector();

    if (Math.abs(this.z - this.sector.bottomZ) < 0.01)
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
        renderer.frameTint = 255 | ((this.hurtTime * 200 / GAME_CONSTANTS.playerHurtTime) & 0xFF) << 24;
        this.hurtTime--;
    }
};

Player.prototype.hurt = function (amount) {
    this.parent.hurt.call(this, amount);

    this.hurtTime = GAME_CONSTANTS.playerHurtTime;
};

Player.prototype.move = function (angle, lastFrameTime) {
    var opx = this.x;
    var opy = this.y;

    var xAllowed = true;
    var yAllowed = true;

    var vx = this.velX + Math.cos(angle * deg2rad) * GAME_CONSTANTS.playerSpeed * 4.0;
    var vy = this.velY;

    this.x += vx * lastFrameTime / 30.0;
    this.y += vy * lastFrameTime / 30.0;

    if (!this.updateSector()) {
        xAllowed = false;
    }

    vx = this.velX;
    vy = this.velY + Math.sin(angle * deg2rad) * GAME_CONSTANTS.playerSpeed * 4.0;

    this.x = opx + vx * lastFrameTime / 30.0;
    this.y = opy + vy * lastFrameTime / 30.0;

    if (!this.updateSector()) {
        yAllowed = false;
    }

    if (xAllowed && yAllowed) {
        vx = this.velX + Math.cos(angle * deg2rad) * GAME_CONSTANTS.playerSpeed * 4.0;
        vy = this.velY + Math.sin(angle * deg2rad) * GAME_CONSTANTS.playerSpeed * 4.0;
        this.x = opx + vx * lastFrameTime / 30.0;
        this.y = opy + vy * lastFrameTime / 30.0;
        if (!this.updateSector()) {
            xAllowed = false;
            yAllowed = false;
        }
    }

    if (xAllowed)
        this.velX += Math.cos(angle * deg2rad) * GAME_CONSTANTS.playerSpeed;
    if (yAllowed)
        this.velY += Math.sin(angle * deg2rad) * GAME_CONSTANTS.playerSpeed;

    this.x = opx;
    this.y = opy;
}