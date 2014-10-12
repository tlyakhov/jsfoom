inherit(Behavior, WanderBehavior);

function WanderBehavior(options) {
    Behavior.call(this, options);

    this.target = null;
    this.speed = 0.1;
    this.moveZ = false;
    this.lastChange = preciseTime();
    this.facing = true;

    $.extend(true, this, options);
}

WanderBehavior.editableProperties = Behavior.editableProperties.concat([
    { name: 'speed', friendly: 'Speed', type: 'float' },
    { name: 'moveZ', friendly: 'Move vertically?', type: 'bool' },
    { name: 'facing', friendly: 'Change facing?', type: 'bool' }
]);

classes['WanderBehavior'] = WanderBehavior;

WanderBehavior.prototype.frame = function (lastFrameTime) {
    if(!this.active)
        return;
    Behavior.prototype.frame.call(this, lastFrameTime);

    var entity = this.entity;
    var map = this.entity.map;

    if (!entity.sector)
        return;

    if (!this.moveZ && this.target)
        this.target[2] = entity.pos[2];

    var overTime = (preciseTime() - this.lastChange) > 15000;
    var smallSector = entity.sector.area() <= Math.PI * sqr(entity.boundingRadius);

    if (!this.target || overTime ||
        vec3dist2(entity.pos, this.target) < sqr(entity.boundingRadius)) {
        this.lastChange = preciseTime();
        this.target = vec3create(0, 0, entity.sector.bottomZ);
        var moveSector = (overTime || smallSector) ? Math.random() * GAME_CONSTANTS.wanderSectorProbablity : Math.random();

        if (moveSector < GAME_CONSTANTS.wanderSectorProbablity) {
            var available = [];
            for (var i = 0; i < entity.sector.segments.length; i++) {
                var segment = entity.sector.segments[i];

                if (!segment.adjacentSectorId)
                    continue;

                var adj = segment.getAdjacentSector();

                if (entity.pos[2] + entity.mountHeight >= adj.bottomZ &&
                    entity.pos[2] + entity.height < adj.topZ || isA(adj, MapSectorVerticalDoor)) {
                    available.push(segment.getAdjacentSegment());
                }
            }
            if (available.length > 0) {
                var ts = available[fast_floor(moveSector * available.length / GAME_CONSTANTS.wanderSectorProbablity)];

                this.target[0] = (ts.bx + ts.ax) * 0.5 + ts.normal[0] * entity.boundingRadius * 2;
                this.target[1] = (ts.by + ts.ay) * 0.5 + ts.normal[1] * entity.boundingRadius * 2;
            }
        }
        else {
            do
            {
                this.target[0] = entity.sector.min[0] + Math.random() * (entity.sector.max[0] - entity.sector.min[0]);
                this.target[1] = entity.sector.min[1] + Math.random() * (entity.sector.max[1] - entity.sector.min[1]);
            }
            while (!entity.sector.isPointInside(this.target[0], this.target[1]))
        }
    }

    var tempvec = vec3blank(true);
    vec3sub(this.target, entity.pos, tempvec);
    vec3normalize(tempvec, tempvec);
    vec3mul(tempvec, this.speed, tempvec);
    vec3add(entity.vel, tempvec, entity.vel);
    vec3mul(entity.vel, 0.5, entity.vel);
    if (this.facing)
        entity.angle = entity.angleTo(entity.pos[0] + entity.vel[0], entity.pos[1] + entity.vel[1]);
};

WanderBehavior.prototype.serialize = function () {
    var r = Behavior.prototype.serialize.call(this);

    r.moveZ = this.moveZ;
    r.speed = this.speed;
    r.facing = this.facing;

    return r;
};

WanderBehavior.deserialize = function (data, entity, behavior) {
    behavior = Behavior.deserialize(data, entity, behavior);

    behavior.moveZ = data.moveZ;
    behavior.speed = data.speed;
    behavior.facing = data.facing;

    return behavior;
};