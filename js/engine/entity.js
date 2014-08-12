function Entity(options) {
    this.map = null;
    this.sector = null;
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
    this.width = 64.0;
    this.height = 64.0;
    this.angle = 0.0;
    this.velX = 0.0;
    this.velY = 0.0;
    this.velZ = 0.0;
    this.type = null;
    this.hurtTime = 0;
    this.boundingRadius = 10.0;
    this.collisionResponse = 'slide'; // can be 'slide', 'bounce', or 'stop'
    this.health = 100;
    this.mountHeight = GAME_CONSTANTS.playerMountHeight;
    this.spriteSources = [];
    this.sprites = [];
    this.zOffset = 0.0;


    if (options) {
        $.extend(true, this, options);

        if (this.map)
            this.updateSector();
    }
}

Entity.prototype.angleTo = function (x, y) {
    var dx = this.x - x;
    var dy = this.y - y;

    return Math.atan2(dy, dx) * rad2deg + 180.0;
};

Entity.prototype.distanceTo = function (x, y) {
    return Math.sqrt(sqr(x - this.x) + sqr(y - this.y));
};

Entity.prototype.getSprite = function (sprite) {
    if (!this.spriteSources || sprite >= this.spriteSources.length)
        return null;

    if (this.sprites.length != this.spriteSources.length) {
        this.sprites = [];
        for (var i = 0; i < this.spriteSources.length; i++) {
            this.sprites.push(textureCache.get(this.spriteSources[i], true, false));
        }
    }

    return this.sprites[sprite];
};

Entity.prototype.collide = function (frameScale) {
    var stopStepping = false;

    var vv = Math.sqrt(sqr(this.velX) + sqr(this.velY)) * frameScale;
    var steps = Math.max(fast_floor(vv / GAME_CONSTANTS.collisionCheck), 1);
    for (var step = 0; step < steps; step++) {
        this.x += this.velX * frameScale / steps;
        this.y += this.velY * frameScale / steps;

        for (var i = 0; i < this.sector.segments.length; i++) {
            var segment = this.sector.segments[i];

            if (segment.getAdjacentSector())
                continue;

            var d = segment.distanceToPoint2(this.x, this.y);

            if (d < sqr(this.boundingRadius)) {
                d = Math.sqrt(d);
                var side = segment.whichSide(this.x, this.y);
                this.x -= segment.normalX * side * (this.boundingRadius - d);
                this.y -= segment.normalY * side * (this.boundingRadius - d);

                if (this.collisionResponse == 'stop') {
                    stopStepping = true;
                    this.velX = 0;
                    this.velY = 0;
                }
                else if (this.collisionResponse == 'bounce') {
                    stopStepping = true;
                    var dot = this.velX * segment.normalX + this.velY * segment.normalY;
                    this.velX = this.velX - 2 * dot * segment.normalX;
                    this.velY = this.velY - 2 * dot * segment.normalY;
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

        this.z += this.velZ * frameScale;

        if (Math.abs(this.velX) > GAME_CONSTANTS.velocityEpsilon || Math.abs(this.velY) > GAME_CONSTANTS.velocityEpsilon) {
            this.collide(frameScale);
        }
    }

    this.updateSector();
};

Entity.prototype.hurt = function (amount) {
    this.health -= amount;
};

Entity.prototype.updateSector = function () {
    if (this.sector && this.sector.isPointInside(this.x, this.y))
        return true;

    for (var i = 0; i < this.map.sectors.length; i++) {
        var sector = this.map.sectors[i];

        if (sector.topZ - sector.bottomZ < this.boundingRadius * 2 || sector.bottomZ - this.z > this.mountHeight)
            continue;

        if (sector.isPointInside(this.x, this.y)) {
            if (this.sector)
                this.sector.onExit(this);
            this.sector = sector;
            this.sector.onEnter(this);
            return true;
        }
    }


    /*for (var i = 0; i < this.sector.segments.length; i++) {
     var segment = this.sector.segments[i];
        var adj = segment.getAdjacentSector();
        if (adj && adj.isPointInside(this.x, this.y)) {
            if (adj.topZ - adj.bottomZ < this.height || adj.bottomZ - this.z > this.mountHeight)
                continue;

            this.sector.onExit(this);
            this.sector = segment.getAdjacentSector();
            this.sector.onEnter(this);
            return true;
        }
     }*/

    return false;
};