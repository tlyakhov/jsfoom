function Entity(options) {
    this.id = "Entity_" + (new ObjectId().toString());
    this.map = null;
    this.sector = null;
    this.pos = vec3create(0.0, 0.0, 0.0);
    this.angle = 0.0;
    this.vel = vec3blank(false);
    this.hurtTime = 0;
    this.boundingRadius = 10.0;
    this.collisionResponse = 'slide'; // can be 'slide', 'bounce', or 'stop'
    this.health = 100;
    this.mountHeight = GAME_CONSTANTS.playerMountHeight;
    this.behaviors = [];
    this.active = true;

    if (options) {
        $.extend(true, this, options);
    }
}

classes['Entity'] = Entity;

Entity.editableProperties = [
    { name: 'id', friendly: 'ID', type: 'string' },
    { name: 'active', friendly: 'Active', type: 'bool' },
    { name: 'pos', friendly: 'Position', type: 'vector' },
    { name: 'angle', friendly: 'Angle', type: 'float' },
    { name: 'boundingRadius', friendly: 'Bounding Radius', type: 'float' },
    { name: 'collisionResponse', friendly: 'Collision Response', type: [ 'slide', 'bounce', 'stop' ] }
];

Entity.prototype.angleTo = function (x, y) {
    var dx = this.pos[0] - x;
    var dy = this.pos[1] - y;

    return Math.atan2(dy, dx) * rad2deg + 180.0;
};

Entity.prototype.distanceTo = function (x, y) {
    return Math.sqrt(sqr(x - this.pos[0]) + sqr(y - this.pos[1]));
};

Entity.prototype.moveToSector = function (sector) {
    this.sector = sector;

    var nearestDist = null;
    var nearestSegment = null;

    for (var i = 0; i < this.sector.segments.length; i++) {
        var segment = this.sector.segments[i];

        if (segment.getAdjacentSector())
            continue;

        var d = segment.distanceToPoint2(this.pos[0], this.pos[1]);

        if (nearestDist == null || d < nearestDist) {
            nearestSegment = segment;
            nearestDist = d;
        }
    }


};

Entity.prototype.pushBack = function (segment) {
    var d = segment.distanceToPoint2(this.pos[0], this.pos[1]);
    var side = segment.whichSide(this.pos[0], this.pos[1]);
    if (d > sqr(this.boundingRadius))
        return false;

    var closest = segment.closestToPoint(this.pos[0], this.pos[1], true);
    var v = vec3blank(true);
    vec3sub(this.pos, closest, v);
    v[2] = 0;
    d = vec3length(v);
    vec3normalize(v, v);
    if (side > 0)
        vec3mul(v, this.boundingRadius - d, v);
    else
        vec3mul(v, -this.boundingRadius - d, v);
    vec3add(this.pos, v, this.pos);

    return true;
};

Entity.prototype.collide = function () {
    if (!this.map)
        return false;

    // We've got several possibilities we need to handle:
    // 1.   The entity is outside of all sectors. Put it into the nearest sector.
    // 2.   The entity has an un-initialized sector, but it's within a sector and doesn't need to be moved.
    // 3.   The entity is still in its current sector, but it's gotten too close to a wall and needs to be pushed back.
    // 4.   The entity is outside of the current sector because it's gone past a wall and needs to be pushed back.
    // 5.   The entity is outside of the current sector because it's gone through a portal and needs to change sectors.
    // 6.   The entity is outside of the current sector because it's gone through a portal, but it winds up outside of
    //      any sectors and needs to be pushed back into a valid sector using any walls within bounds.
    // 7.   No collision occured.

    // The central method here is to push back, but the wall that's doing the pushing requires some logic to get.

    // Assume we haven't collided.
    var collided = [];

    // Cases 1 & 2.
    if (!this.sector) {
        var closestSector = null;
        var closestDistance2 = null;
        for (var i = 0; i < this.map.sectors.length; i++) {
            var sector = this.map.sectors[i];
            var d2 = vec3dist2(this.pos, sector.center);

            if (closestDistance2 == null || d2 < closestDistance2) {
                closestDistance2 = d2;
                closestSector = sector;
            }
        }

        if (!closestSector.isPointInside(this.pos[0], this.pos[1])) {
            this.pos[0] = closestSector.center[0];
            this.pos[1] = closestSector.center[1];
            this.pos[2] = closestSector.center[2];
        }
        else if (this.pos[2] < closestSector.bottomZ || this.pos[2] + this.height > closestSector.topZ)
            this.pos[2] = closestSector.center[2];

        this.sector = closestSector;
        if ($.inArray(this, this.sector.entities) == -1)
            this.sector.entities.push(this);
        this.sector.onEnter(this);
        // Don't mark as collided because this is probably an initialization.
    }

    // Case 3 & 4
    // See if we need to push back into the current sector.
    for (var i = 0; i < this.sector.segments.length; i++) {
        var segment = this.sector.segments[i];
        var adj = segment.getAdjacentSector();
        if (adj) {
            // We can still collide with a portal if the heights don't match.
            // If we're within limits, ignore the portal.
            if (this.pos[2] + this.mountHeight >= adj.bottomZ &&
                this.pos[2] + this.height < adj.topZ)
                continue;
        }
        if (this.pushBack(segment))
            collided.push(segment);
    }

    var inSector = this.sector.isPointInside(this.pos[0], this.pos[1]);

    if (!inSector) {
        // Cases 5 & 6

        // Exit the current sector.
        this.sector.onExit(this);
        var index = $.inArray(this, this.sector.entities);
        if (index != -1)
            this.sector.entities.splice(index, 1);

        this.sector = null;

        for (var i = 0; i < this.map.sectors.length; i++) {
            var sector = this.map.sectors[i];

            if (this.pos[2] + this.mountHeight >= sector.bottomZ &&
                this.pos[2] + this.height < sector.topZ &&
                sector.isPointInside(this.pos[0], this.pos[1])) {
                // Hooray, we've handled case 5! Make sure Z is good.
                this.sector = sector;
                if (this.pos[2] < this.sector.bottomZ)
                    this.pos[2] = this.sector.bottomZ;
                if ($.inArray(this, this.sector.entities) == -1)
                    this.sector.entities.push(this);
                this.sector.onEnter(this);
                break;
            }
        }

        if (!this.sector) {
            // Case 6! This is the worst.
            for (var i = 0; i < this.map.sectors.length; i++) {
                var sector = this.map.sectors[i];

                if (this.pos[2] + this.mountHeight >= sector.bottomZ &&
                    this.pos[2] + this.height < sector.topZ) {

                    for (var j = 0; j < sector.segments.length; j++) {
                        if (this.pushBack(sector.segments[j])) {
                            collided.push(sector.segments[j]);
                        }
                    }
                }
            }
            collided = collided.concat(this.collide()); // RECURSIVE! Can be infinite, I suppose?
        }
    }

    if (collided.length > 0) {
        if (this.collisionResponse == 'stop') {
            this.vel[0] = 0;
            this.vel[1] = 0;
        }
        else if (this.collisionResponse == 'bounce') {
            var dot = this.vel[0] * segment.normal[0] + this.vel[1] * segment.normal[1];
            this.vel[0] = this.vel[0] - 2 * dot * segment.normal[0];
            this.vel[1] = this.vel[1] - 2 * dot * segment.normal[1];
        }
    }

    return collided;
};

Entity.prototype.frame = function (lastFrameTime) {
    var frameScale = lastFrameTime / 10.0;

    if (Math.abs(this.vel[0]) > GAME_CONSTANTS.velocityEpsilon || Math.abs(this.vel[1]) > GAME_CONSTANTS.velocityEpsilon || Math.abs(this.vel[2]) > GAME_CONSTANTS.velocityEpsilon) {
        var vv = Math.sqrt(sqr(this.vel[0]) + sqr(this.vel[1])) * frameScale;
        var steps = Math.max(fast_floor(vv / GAME_CONSTANTS.collisionCheck), 1);
        for (var step = 0; step < steps; step++) {
            vec3add(this.pos, vec3mul(this.vel, frameScale / steps, vec3blank(true)), this.pos);

            var collidedSegments = this.collide();
            if (collidedSegments.length > 0)
                break;
        }
    }

    for (var i = 0; i < this.behaviors.length; i++) {
        this.behaviors[i].frame(lastFrameTime);
    }
};

Entity.prototype.hurt = function (amount) {
    this.health -= amount;
};

Entity.prototype.serialize = function () {
    var r = {
        _type: this.constructor.name,
        id: this.id,
        pos: this.pos,
        angle: this.angle,
        vel: this.vel,
        hurtTime: this.hurtTime,
        boundingRadius: this.boundingRadius,
        collisionResponse: this.collisionResponse,
        health: this.health,
        mountHeight: this.mountHeight,
        behaviors: [],
        active: this.active
    };

    for (var i = 0; i < this.behaviors.length; i++)
        r.behaviors.push(this.behaviors[i].serialize());
    return r;
};

Entity.deserialize = function (data, map, entity) {
    if (!entity || entity.constructor.name != data._type)
        entity = createFromName(data._type, {});

    entity.id = data.id;
    entity.pos = data.pos;
    entity.angle = data.angle;
    entity.vel = data.vel;
    entity.hurtTime = data.hurtTime;
    entity.boundingRadius = data.boundingRadius;
    entity.collisionResponse = data.collisionResponse;
    entity.health = data.health;
    entity.mountHeight = data.mountHeight;
    entity.active = data.active;
    entity.map = map;

    for (var i = 0; i < data.behaviors.length; i++) {
        if (i >= entity.behaviors.length)
            entity.behaviors.push(classes[data.behaviors[i]._type].deserialize(data.behaviors[i], entity));
        else
            classes[data.behaviors[i]._type].deserialize(data.behaviors[i], entity, entity.behaviors[i]);
    }

    return entity;
};