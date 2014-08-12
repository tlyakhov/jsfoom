function Entity(options) {
    this.map = null;
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
    this.angle = 0.0;
    this.velX = 0.0;
    this.velY = 0.0;
    this.velZ = 0.0;

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
    this.x += this.velX * lastFrameTime / 10.0;
    this.y += this.velY * lastFrameTime / 10.0;
    this.z += this.velZ * lastFrameTime / 10.0;

};

Entity.prototype.hurt = function (amount) {
    this.health -= amount;
};

Entity.prototype.updateSector = function () {
    if (!this.sector) {
        for (var i = 0; i < this.map.sectors.length; i++) {
            if (this.map.sectors[i].isPointInside(this.x, this.y)) {
                this.sector = this.map.sectors[i];
                this.sector.onEnter(this);
                return true;
            }
        }
        return false;
    }

    if (this.sector.isPointInside(this.x, this.y))
        return true;

    for (var i = 0; i < this.sector.segments.length; i++) {
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
    }

    return false;
};