function Entity(options) {
    this.id = "Entity_" + (new ObjectId().toString());
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

classes['Entity'] = Entity;

Entity.editableProperties = [
    { name: 'id', friendly: 'ID', type: 'string' },
    { name: 'pos', friendly: 'Position', type: 'vector' },
    { name: 'angle', friendly: 'Angle', type: 'float' },
    { name: 'width', friendly: 'Width', type: 'float' },
    { name: 'height', friendly: 'Height', type: 'float' },
    { name: 'boundingRadius', friendly: 'Bounding Radius', type: 'float' },
    { name: 'collisionResponse', friendly: 'Collision Response', type: [ 'slide', 'bounce', 'stop' ] },
    { name: 'zOffset', friendly: 'Vertical Offset', type: 'float' }
];

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

Entity.prototype.serialize = function () {
    var r = {
        _type: this.constructor.name,
        pos: this.pos,
        width: this.width,
        height: this.height,
        angle: this.angle,
        vel: this.vel,
        type: this.type,
        renderable: this.renderable,
        hurtTime: this.hurtTime,
        boundingRadius: this.boundingRadius,
        collisionResponse: this.collisionResponse,
        health: this.health,
        mountHeight: this.mountHeight,
        zOffset: this.zOffset,
        sprites: {}
    };

    for (var s in this.sprites) {
        r.sprites[s] = this.sprites[s].serialize();
    }

    return r;
};

Entity.deserialize = function (data, map, entity) {
    if (!entity)
        entity = createFromName(data._type, {});

    entity.pos = data.pos;
    entity.width = data.width;
    entity.height = data.height;
    entity.angle = data.angle;
    entity.vel = data.vel;
    entity.type = data.type;
    entity.renderable = data.renderable;
    entity.hurtTime = data.hurtTime;
    entity.boundingRadius = data.boundingRadius;
    entity.collisionResponse = data.collisionResponse;
    entity.health = data.health;
    entity.mountHeight = data.mountHeight;
    entity.zOffset = data.zOffset;
    entity.map = map;

    for (var s in data.sprites) {
        entity.sprites[s] = Sprite.deserialize(data.sprites[s], entity.sprites[s]);
    }

    return entity;
};