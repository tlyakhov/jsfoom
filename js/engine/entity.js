function Entity(options) {
    this.map = null;
    this.sector = null;
    this.pos = vec3create(0.0, 0.0, 0.0);
    this.width = 64.0;
    this.height = 64.0;
    this.angle = 0.0;
    this.vel = vec3blank(false);
    this.type = null;
    this.renderable = true;
    this.hurtTime = 0;
    this.boundingRadius = 10.0;
    this.collisionResponse = 'slide'; // can be 'slide', 'bounce', or 'stop'
    this.health = 100;
    this.mountHeight = GAME_CONSTANTS.playerMountHeight;
    this.sprites = {};
    this.zOffset = 0.0;


    if (options) {
        $.extend(true, this, options);

        if (this.map)
            this.updateSector();
    }
}

Entity.prototype.angleTo = function (x, y) {
    var dx = this.pos[0] - x;
    var dy = this.pos[1] - y;

    return Math.atan2(dy, dx) * rad2deg + 180.0;
};

Entity.prototype.distanceTo = function (x, y) {
    return Math.sqrt(sqr(x - this.pos[0]) + sqr(y - this.pos[1]));
};

Entity.prototype.getSprite = function (angle) {
    var index = fast_floor(angle * Object.keys(this.sprites).length / 360.0);

    return this.sprites[index];
};

Entity.prototype.collide = function (frameScale) {
    var stopStepping = false;

    var vv = Math.sqrt(sqr(this.vel[0]) + sqr(this.vel[1])) * frameScale;
    var steps = Math.max(fast_floor(vv / GAME_CONSTANTS.collisionCheck), 1);
    for (var step = 0; step < steps; step++) {
        vec3add(this.pos, vec3mul(this.vel, frameScale / steps, vec3blank(true)), this.pos);

        for (var i = 0; i < this.sector.segments.length; i++) {
            var segment = this.sector.segments[i];

            if (segment.getAdjacentSector())
                continue;

            var d = segment.distanceToPoint2(this.pos[0], this.pos[1]);

            if (d < sqr(this.boundingRadius)) {
                d = Math.sqrt(d);
                var side = segment.whichSide(this.pos[0], this.pos[1]);
                this.pos[0] -= segment.normalX * side * (this.boundingRadius - d);
                this.pos[1] -= segment.normalY * side * (this.boundingRadius - d);

                if (this.collisionResponse == 'stop') {
                    stopStepping = true;
                    this.vel[0] = 0;
                    this.vel[1] = 0;
                }
                else if (this.collisionResponse == 'bounce') {
                    stopStepping = true;
                    var dot = this.vel[0] * segment.normalX + this.vel[1] * segment.normalY;
                    this.vel[0] = this.vel[0] - 2 * dot * segment.normalX;
                    this.vel[1] = this.vel[1] - 2 * dot * segment.normalY;
                    break;
                }
                else {
                }
            }
        }

        if (stopStepping)
            break;
    }
};

Entity.prototype.frame = function (lastFrameTime) {
    if (this.sector) {
        var frameScale = lastFrameTime / 10.0;

        if (Math.abs(this.vel[0]) > GAME_CONSTANTS.velocityEpsilon || Math.abs(this.vel[1]) > GAME_CONSTANTS.velocityEpsilon || Math.abs(this.vel[2]) > GAME_CONSTANTS.velocityEpsilon) {
            this.collide(frameScale);
        }
    }

    this.updateSector();
};

Entity.prototype.hurt = function (amount) {
    this.health -= amount;
};

Entity.prototype.updateSector = function () {
    if (this.sector && this.sector.isPointInside(this.pos[0], this.pos[1]))
        return true;

    for (var i = 0; i < this.map.sectors.length; i++) {
        var sector = this.map.sectors[i];

        if (sector.topZ - sector.bottomZ < this.boundingRadius * 2 || sector.bottomZ - this.pos[2] > this.mountHeight)
            continue;

        if (sector.isPointInside(this.pos[0], this.pos[1])) {
            if (this.sector)
                this.sector.onExit(this);
            this.sector = sector;
            this.sector.onEnter(this);
            return true;
        }
    }

    return false;
};