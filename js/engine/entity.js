function Entity(options) {
    this.map = null;
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
    this.angle = 0.0;
    this.velX = 0.0;
    this.velY = 0.0;
    this.velZ = 0.0;
    this.boundingRadius = 10.0;
    this.collisionResponse = 'slide'; // can be 'slide', 'bounce', or 'stop'
    this.sector = null;

    this.health = 100;
    this.hurtTime = 0;
    this.mountHeight = GAME_CONSTANTS.playerMountHeight;

    if (options || this.map) {
        $.extend(true, this, options);

        this.updateSector();
    }
}

Entity.prototype.frame = function (lastFrameTime) {
    if (this.sector) {
        var frameScale = lastFrameTime / 10.0;

        this.z += this.velZ * frameScale;

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

        if (sector.topZ - sector.bottomZ < this.height || sector.bottomZ - this.z > this.mountHeight)
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