inherit(InteractionBehavior, RifleBehavior);

function RifleBehavior(options) {
    InteractionBehavior.call(this, options);

    this.strength = 5.0;
    this.minDistance = null;

    $.extend(true, this, options);
}

classes['RifleBehavior'] = RifleBehavior;

RifleBehavior.editableProperties = InteractionBehavior.editableProperties.concat([
    { name: 'strength', friendly: 'Strength', type: 'float' }
]);

RifleBehavior.prototype.frame = function(lastFrameTime) {
    InteractionBehavior.prototype.frame.call(this, lastFrameTime);
};

RifleBehavior.prototype.interact = function (lastFrameTime, target) {
    InteractionBehavior.prototype.interact.call(this, lastFrameTime, target);

    var sector = this.entity.sector;
    var ray = vec3sub(target.pos, this.entity.pos, vec3blank());

    /*vec3normalize(ray, ray);
    vec3mul(ray, GAME_CONSTANTS.maxViewDistance, ray);*/

    var rayLength = vec3length(ray);

    var blocked = false;

    while (sector) {
        var next = null;
        for (var k = 0; k < sector.segments.length; k++) {
            var segment = sector.segments[k];

            if (vec3dot(ray, segment.normal) > 0)
                continue;

            var intersection = segment.intersect(this.entity.pos[0], this.entity.pos[1], target.pos[0], target.pos[1]);

            if (intersection && segment.adjacentSectorId) {
                var adj = segment.getAdjacentSector();

                if (!adj)
                    continue;

                // Get the z
                var r = Math.sqrt(sqr(intersection[0] - this.entity.pos[0]) + sqr(intersection[1] - this.entity.pos[1])) / rayLength;
                var z = r * this.entity.pos[2] + (1.0 - r) * ray[2];

                if (z >= adj.bottomZ && z <= adj.topZ) {
                    next = adj;
                }
                else { // Hit a hi/lo wall
                    blocked = true;
                    break;
                }
            }
            else if (intersection) { // hit a mid wall
                // Get the z
                var r = Math.sqrt(sqr(intersection[0] - this.entity.pos[0]) + sqr(intersection[1] - this.entity.pos[1])) / rayLength;
                var z = r * this.entity.pos[2] + (1.0 - r) * ray[2];
                blocked = true;
                break;
            }
        }
        if (next)
            sector = next;
        else
            break;
    }

    if(!blocked) {
        if (target.hurtTime == 0)
            target.hurt(this.strength);
    }
};

RifleBehavior.prototype.serialize = function () {
    var r = InteractionBehavior.prototype.serialize.call(this);

    r.strength = this.strength;

    return r;
};

RifleBehavior.deserialize = function (data, entity, behavior) {
    behavior = InteractionBehavior.deserialize(data, entity, behavior);

    behavior.strength = data.strength;

    return behavior;
};