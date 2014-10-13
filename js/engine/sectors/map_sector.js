inherit(EngineObject, MapSector);

function MapSector(options) {
    EngineObject.call(this, options);
    
    this.segments = [];
    this.entities = [];
    this.map = null;
    this.bottomZ = 0;
    this.topZ = 64;
    this.floorMaterialId = "Default";
    this.floorMaterial = null;
    this.floorLightmap = null;
    this.ceilMaterialId = "Default";
    this.ceilMaterial = null;
    this.ceilLightmap = null;
    this.min = vec3blank();
    this.max = vec3blank();
    this.lightmapWidth = 0;
    this.lightmapHeight = 0;
    this.pvs = {};
    this.pvsEntity = {};
    this.pvsLights = [];
    this.center = vec3blank();
    this.floorScale = 64.0;
    this.ceilScale = 64.0;
    this.hurt = 0;
    this.floorTargetSectorId = null;
    this.ceilTargetSectorId = null;
    this.version = 0;
    this.roomImpulse = '/data/sounds/impulses/empty_restaurant.wav';

    $.extend(true, this, options);

    if (this.segments.length > 0)
        this.update();
}

MapSector.editableProperties = EngineObject.editableProperties.concat([
    { name: 'topZ', friendly: 'Ceiling Height', type: 'float' },
    { name: 'bottomZ', friendly: 'Floor Height', type: 'float' },
    { name: 'hurt', friendly: 'Hit points', type: 'float' },
    { name: 'floorScale', friendly: 'Floor Texture Scale', type: 'float' },
    { name: 'ceilScale', friendly: 'Ceiling Texture Scale', type: 'float' },
    { name: 'ceilMaterialId', friendly: 'Ceiling Material', type: 'material_id' },
    { name: 'floorMaterialId', friendly: 'Floor Material', type: 'material_id' },
    { name: 'roomImpulse', friendly: 'Room Sound Impulse', type: 'string' }
]);

classes['MapSector'] = MapSector;

MapSector.prototype.updatePVS = function (normalX, normalY, sector) {
    if (sector == undefined) {
        this.pvs = {};
        this.pvs[this.id] = this;
        this.pvsLights = this.entities.filter(function (element) {
            return element.getBehavior(LightBehavior) != null;
        });
        sector = this;
    }

    for (var i = 0; i < sector.segments.length; i++) {
        var segment = sector.segments[i];
        var adj = segment.getAdjacentSegment();
        if (!adj || Math.abs(adj.sector.topZ - adj.sector.bottomZ) < GAME_CONSTANTS.velocityEpsilon || adj.midMaterialId != null)
            continue;

        if ((normalX == undefined || normalX * segment.normal[0] + normalY * segment.normal[1] >= 0) && !this.pvs[adj.sector.id]) {
            this.pvs[adj.sector.id] = adj.sector;
            this.pvsLights = this.pvsLights.concat(adj.sector.entities.filter(function (element) {
                return element.getBehavior(LightBehavior) != null;
            }));
            if (normalX == undefined)
                this.updatePVS(segment.normal[0], segment.normal[1], adj.sector);
            else
                this.updatePVS(normalX, normalY, adj.sector);
        }
    }
};

MapSector.prototype.updateEntityPVS = function (normalX, normalY, sector) {
    if (sector == undefined) {
        this.pvsEntity = {};
        this.pvsEntity[this.id] = this;
        sector = this;
    }

    for (var i = 0; i < sector.segments.length; i++) {
        var segment = sector.segments[i];
        var adj = segment.getAdjacentSegment();
        if (!adj || adj.midMaterialId != null)
            continue;

        if ((normalX == undefined || normalX * segment.normal[0] + normalY * segment.normal[1] >= 0) && !this.pvsEntity[adj.sector.id]) {
            this.pvsEntity[adj.sector.id] = adj.sector;

            if (normalX == undefined)
                this.updateEntityPVS(segment.normal[0], segment.normal[1], adj.sector);
            else
                this.updateEntityPVS(normalX, normalY, adj.sector);
        }
    }
};

MapSector.prototype.markVisibleLights = function (point) {
    var tempvec = vec3blank(true);
    // Shadows!
    for (var i = 0; i < this.pvsLights.length; i++) {
        var lightEntity = this.pvsLights[i];

        if(!lightEntity.active)
            continue;

        for (var j = 0; j < lightEntity.behaviors.length; j++) {
            if (!isA(lightEntity.behaviors[j], LightBehavior))
                continue;

            var light = lightEntity.behaviors[j];

            light.marked = true;

            var rayLength = vec3dist(point, lightEntity.pos);

            if (rayLength == 0) {
                continue;
            }

            var sector = this;

            while (sector) {
                var next = null;
                for (var k = 0; k < sector.segments.length; k++) {
                    var segment = sector.segments[k];

                    vec3sub(lightEntity.pos, point, tempvec);

                    if (vec3dot(tempvec, segment.normal) > 0)
                        continue;

                    var lightIntersection = segment.intersect(point[0], point[1], lightEntity.pos[0], lightEntity.pos[1]);

                    if (lightIntersection && segment.adjacentSectorId) {
                        var adj = segment.getAdjacentSector();

                        if (!adj)
                            continue;

                        // Get the z
                        var r = Math.sqrt(sqr(lightIntersection[0] - point[0]) + sqr(lightIntersection[1] - point[1])) / rayLength;
                        var z = r * lightEntity.pos[2] + (1.0 - r) * point[2];

                        if (z >= adj.bottomZ && z <= adj.topZ) {
                            next = adj;
                        }
                        else {
                            light.marked = false;
                        }
                    }
                    else if (lightIntersection) { // This light is in shadow
                        light.marked = false;
                    }
                }
                if (next)
                    sector = next;
                else
                    break;
            }
        }
    }
};

MapSector.prototype.calculateLighting = function (segment, normal, lightmap, mapIndex, point) {
    var tempvec = vec3blank();

    if (!this.isPointInside(point[0], point[1])) {
        for(var i = 0; i < this.segments.length; i++) {
            var s = this.segments[i];

            if(s.whichSide(point[0], point[1]) > 0)
                continue;

            var closest = s.closestToPoint(point[0], point[1], true);
            var v = vec3blank(true);
            vec3sub(closest, point, v);
            v[2] = 0;
            var d = vec3length(v);

            if(d > GAME_CONSTANTS.lightGrid * 2)
                continue;
            if(d > GAME_CONSTANTS.intersectEpsilon) {
                vec3normalize(v, v);
                vec3mul(v, d + GAME_CONSTANTS.lightGrid * 0.5, v);
                vec3add(point, v, point);
            }
            else
                vec3add(point, vec3mul(s.normal, GAME_CONSTANTS.lightGrid * 0.5, tempvec), point);
        }
    }

    // Debugging
/*    if (!this.isPointInside(point[0], point[1])) {
        lightmap[mapIndex + 0] = 1.0;
        lightmap[mapIndex + 1] = 0;
        lightmap[mapIndex + 2] = 0;
        return;
    }*/

    this.markVisibleLights(point);

    var diffuseSum = vec3blank();

    var i = this.pvsLights.length;

    while (i--) {
        var lightEntity = this.pvsLights[i];

        if(!lightEntity.active)
            continue;

        for(var j = 0; j < lightEntity.behaviors.length; j++) {
            if(!isA(lightEntity.behaviors[j], LightBehavior))
                continue;

            var light = lightEntity.behaviors[j];

            if (!light.marked) {
                light.marked = true;
                continue;
            }

            var l = vec3sub(lightEntity.pos, point, vec3blank(true));

            var distance = vec3length(l);
            vec3mul(l, 1.0 / distance, l);

            var attenuation = light.attenuation > 0.0 ? light.strength / Math.pow((distance / lightEntity.boundingRadius) + 1.0, light.attenuation) : 1.0;

            if (attenuation < GAME_CONSTANTS.lightAttenuationEpsilon)
                continue;

            var diffuseLight = vec3dot(normal, l) * attenuation;

            if (diffuseLight > 0) {
                vec3add(diffuseSum, vec3mul(light.diffuse, diffuseLight, tempvec), diffuseSum);
            }
        }
    }

    lightmap[mapIndex + 0] = diffuseSum[0];
    lightmap[mapIndex + 1] = diffuseSum[1];
    lightmap[mapIndex + 2] = diffuseSum[2];

    /*var checker = fast_floor((mapIndex / 3) / 8) % 2;

     checker = Math.min(1.0, Math.max(0.0, checker));
     lightmap[mapIndex + 0] = checker;
     lightmap[mapIndex + 1] = checker;
     lightmap[mapIndex + 2] = checker;*/
};

MapSector.prototype.update = function () {
    this.center[0] = 0.0;
    this.center[1] = 0.0;
    this.center[2] = (this.topZ + this.bottomZ) / 2.0;
    this.min[0] = 1e10;
    this.min[1] = 1e10;
    this.min[2] = this.bottomZ;
    this.max[1] = -1e10;
    this.max[1] = -1e10;
    this.max[2] = this.topZ;

    var w = this.winding();

    for (var i = 0; i < this.segments.length; i++) {
        var next = i + 1 >= this.segments.length ? 0 : i + 1;
        this.center[0] += this.segments[i].ax;
        this.center[1] += this.segments[i].ay;
        if (this.segments[i].ax < this.min[0])
            this.min[0] = this.segments[i].ax;
        if (this.segments[i].ay < this.min[1])
            this.min[1] = this.segments[i].ay;
        if (this.segments[i].ax > this.max[0])
            this.max[0] = this.segments[i].ax;
        if (this.segments[i].ay > this.max[1])
            this.max[1] = this.segments[i].ay;

        this.segments[i].sector = this;
        this.segments[i].bx = this.segments[next].ax;
        this.segments[i].by = this.segments[next].ay;
        this.segments[i].update();

        if (!w) {
            this.segments[i].normal[0] = -this.segments[i].normal[0];
            this.segments[i].normal[1] = -this.segments[i].normal[1];
        }
    }

    this.center[0] /= this.segments.length;
    this.center[1] /= this.segments.length;

    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].map = this.map;
        this.entities[i].sector = this;
        this.entities[i].collide();
    }

    this.lightmapWidth = fast_floor((this.max[0] - this.min[0]) / GAME_CONSTANTS.lightGrid) + 6;
    this.lightmapHeight = fast_floor((this.max[1] - this.min[1]) / GAME_CONSTANTS.lightGrid) + 6;

    this.floorLightmap = new Float64Array(this.lightmapWidth * this.lightmapHeight * 3);
    this.ceilLightmap = new Float64Array(this.lightmapWidth * this.lightmapHeight * 3);
    this.clearLightmaps();
    if (globalWorkerId == undefined)
        this.version++;

};

MapSector.prototype.clearLightmaps = function () {
    var index = this.floorLightmap.length;
    while (index--) {
        this.floorLightmap[index] = -1;
        this.ceilLightmap[index] = -1;
    }

    index = this.segments.length;
    while (index--)
        this.segments[index].clearLightmap();

    this.updatePVS();
    this.updateEntityPVS();

    if (globalWorkerId == undefined)
        this.version++;
};

MapSector.prototype.getCeilMaterial = function () {
    if (!this.ceilMaterialId)
        return null;

    if (!this.ceilMaterial || this.ceilMaterial.id != this.ceilMaterialId)
        this.ceilMaterial = this.map.getMaterial(this.ceilMaterialId);

    return this.ceilMaterial;
};

MapSector.prototype.getFloorMaterial = function () {
    if (!this.floorMaterialId)
        return null;

    if (!this.floorMaterial || this.floorMaterial.id != this.floorMaterialId)
        this.floorMaterial = this.map.getMaterial(this.floorMaterialId);

    return this.floorMaterial;
};

MapSector.prototype.isPointInside = function (x, y) {
    var inside = false;
    var flag1 = (y >= this.segments[0].ay);
    var j = 1;

    for (var i = 0; i < this.segments.length; i++) {
        flag2 = (y >= this.segments[j].ay);
        if (flag1 != flag2) {
            if (((this.segments[j].ay - y) * (this.segments[i].ax - this.segments[j].ax) >=
                (this.segments[j].ax - x) * (this.segments[i].ay - this.segments[j].ay)) == flag2) {
                inside = !inside;
            }
        }
        flag1 = flag2;
        j++;
        if (j == this.segments.length)
            j = 0;
    }

    return inside;
};

MapSector.prototype.winding = function () {
    var sum = 0;

    for (var i = 0; i < this.segments.length; i++) {
        var next = (i + 1 >= this.segments.length) ? 0 : i + 1;
        var segment = this.segments[i];
        var segment2 = this.segments[next];
        sum += (segment2.ax - segment.ax) * (segment.ay + segment2.ay);
    }

    return sum < 0;
};

MapSector.prototype.lightmapAddress = function (point) {
    return (Math.max(fast_floor((point[0] - this.min[0]) / GAME_CONSTANTS.lightGrid) + 3, 0) +
        Math.max(fast_floor((point[1] - this.min[1]) / GAME_CONSTANTS.lightGrid) + 3, 0) * this.lightmapWidth) * 3;
};

MapSector.prototype.lightmapWorld = function (point, pool) {
    return vec3create(this.min[0] + fast_floor((point[0] - this.min[0]) / GAME_CONSTANTS.lightGrid) * GAME_CONSTANTS.lightGrid,
            this.min[1] + fast_floor((point[1] - this.min[1]) / GAME_CONSTANTS.lightGrid) * GAME_CONSTANTS.lightGrid,
        point[2], pool);
};

MapSector.prototype.lightmapAddressToWorld = function (mapIndex, floor, pool) {
    var u = fast_floor(mapIndex / 3) % this.lightmapWidth - 3;
    var v = fast_floor(fast_floor(mapIndex / 3) / this.lightmapWidth) - 3;
    return vec3create(this.min[0] + u * GAME_CONSTANTS.lightGrid,
            this.min[1] + v * GAME_CONSTANTS.lightGrid, floor ? this.bottomZ : this.topZ, pool);
};

MapSector.prototype.frame = function (lastFrameTime) {
    for (var i = 0; i < this.entities.length; i++) {
        if (this.entities[i] == this.map.player || !this.entities[i].active)
            continue;

        if (!this.map.entitiesPaused)
            this.entities[i].frame(lastFrameTime);
    }
};

MapSector.prototype.collide = function (entity) {
    var entityTop = entity.pos[2] + entity.height;

    if (this.floorTargetSectorId && entityTop <= this.bottomZ) {
        entity.sector.onExit(entity);
        entity.sector = this.map.getSector(this.floorTargetSectorId);
        entity.sector.onEnter(entity);
        entity.pos[2] = entity.sector.topZ - entity.height - 1.0;
    }
    else if (!this.floorTargetSectorId && entity.pos[2] <= this.bottomZ) {
        entity.vel[2] = 0;
        entity.pos[2] = this.bottomZ;
    }

    if (this.ceilTargetSectorId && entityTop > this.topZ) {
        entity.sector.onExit(entity);
        entity.sector = this.map.getSector(this.ceilTargetSectorId);
        entity.sector.onEnter(entity);
        entity.pos[2] = entity.sector.bottomZ - entity.height + 1.0;
    }
    else if (!this.ceilTargetSectorId && entityTop >= this.topZ) {
        entity.vel[2] = 0;
        entity.pos[2] = this.topZ - entity.height - 1.0;
    }

    if (this.hurt > 0 && entity.hurtTime == 0)
        entity.hurt(this.hurt);

    var fm = this.getFloorMaterial();

    if (fm) {
        if (fm.hurt > 0 && entity.pos[2] <= this.bottomZ && entity.hurtTime == 0) {
            entity.hurt(fm.hurt);
        }
    }

    var cm = this.getCeilMaterial();

    if (cm) {
        if (cm.hurt > 0 && entityTop >= this.topZ && entity.hurtTime == 0) {
            entity.hurt(cm.hurt);
        }
    }
};

MapSector.prototype.actOnEntity = function (entity) {
    if (!entity.sector || entity.sector.id != this.id)
        return;

    if (isA(entity, Player)) {
        entity.vel[0] = 0;
        entity.vel[1] = 0;
    }

    if (entity.constructor.name != 'LightEntity')
        entity.vel[2] -= GAME_CONSTANTS.gravity;

    this.collide(entity);
};

MapSector.prototype.onEnter = function (entity) {
    if (!this.floorTargetSectorId && entity.pos[2] <= entity.sector.bottomZ) {
        //entity.vel[2] = 0;
        entity.pos[2] = entity.sector.bottomZ;
    }
};

MapSector.prototype.onExit = function (entity) {
};

MapSector.prototype.removeUncontainedEntities = function () {
    for (var i = 0; i < this.entities.length; i++) {
        if (!this.isPointInside(this.entities[i].pos[0], this.entities[i].pos[1])) {
            this.entities.splice(i, 1);
            i--;
        }
        else {
            this.entities[i].sector = this;
        }
    }
};

MapSector.prototype._firstWithFlag = function (segments, index) {
    var n = segments.length;
    while (true) {
        index = (index + 1) % n;
        if (segments[index].flag)
            return index;
    }
};

MapSector.prototype._subSector = function (segments, index0, index1) {
    var n = segments.length;
    var subsector = [];
    if (index1 < index0)
        index1 += n;
    for (var i = index0; i <= index1; i++)
        subsector.push(segments[i % n]);
    return subsector;
};

MapSector.prototype.slice = function (ax, ay, bx, by) {
    // If a segment point is the same as a sector point, return the sector
    if (this.isPointInside(ax, ay) || this.isPointInside(bx, by))
        return [ this ];

    var a = vec3create(ax, ay, 0);
    var b = vec3create(bx, by, 0);
    var intersections = [];	// intersections
    var iSegments = [];
    var segments = [];	// points
    for (var i = 0; i < this.segments.length; i++) {
        segments.push(this.segments[i]);
    }

    for (var i = 0; i < segments.length; i++) {
        var intersection = segments[i].intersect(ax, ay, bx, by);
        var fi = intersections.length > 0 ? intersections[0] : null;
        var li = intersections.length > 0 ? intersections[intersections.length - 1] : null;
        if (intersection && (!fi || vec3dist2(intersection, fi) > 1e-10) && (!li || vec3dist2(intersection, li) > 1e-10 )) {
            intersections.push(intersection);
            var newSegment = segments[i].clone();
            newSegment.ax = intersection[0];
            newSegment.ay = intersection[1];
            newSegment.bx = segments[i].bx;
            newSegment.bx = segments[i].by;
            newSegment.flag = true;
            iSegments.push(newSegment);
            segments[i].bx = intersection[0];
            segments[i].by = intersection[1];
            segments.splice(i + 1, 0, newSegment);

            var adjSegment = segments[i].getAdjacentSegment();

            i++;

            if (!adjSegment)
                continue;

            var index = $.inArray(adjSegment, adjSegment.sector.segments);
            newSegment = adjSegment.clone();
            newSegment.ax = intersection[0];
            newSegment.ay = intersection[1];
            newSegment.bx = adjSegment.bx;
            newSegment.bx = adjSegment.by;
            adjSegment.bx = intersection[0];
            adjSegment.by = intersection[1];
            adjSegment.sector.segments.splice(index + 1, 0, newSegment);
            adjSegment.sector.update();
        }
    }

    if (intersections.length < 2)
        return [ this ];

    iSegments.sort(function (u, v) {
        return vec3dist(a, vec3create(u.ax, u.ay, 0, true)) - vec3dist(a, vec3create(v.ax, v.ay, 0, true));
    });

    var slicedSectors = [];
    var dir = 0;
    while (iSegments.length > 0) {
        var n = segments.length;
        var i0 = iSegments[0];
        var i1 = iSegments[1];

        var index0 = segments.indexOf(i0);
        var index1 = segments.indexOf(i1);
        var solved = false;

        if (this._firstWithFlag(segments, index0) == index1) {
            solved = true;
        }
        else {
            i0 = iSegments[1];
            i1 = iSegments[0];
            index0 = segments.indexOf(i0);
            index1 = segments.indexOf(i1);
            if (this._firstWithFlag(segments, index0) == index1)
                solved = true;
        }

        if (solved) {
            dir--;
            var newSegments = this._subSector(segments, index0, index1);

            var newSector = this.clone();
            newSector.segments = [];
            for (var i = 0; i < newSegments.length; i++) {
                newSector.segments.push(newSegments[i].clone());
            }
            newSector.removeUncontainedEntities();
            newSector.update();
            slicedSectors.push(newSector);

            segments = this._subSector(segments, index1, index0);
            i0.flag = i1.flag = false;
            iSegments.splice(0, 2);
            if (iSegments.length == 0) {
                newSector = this.clone();
                newSector.segments = segments;
                newSector.removeUncontainedEntities();
                newSector.update();
                slicedSectors.push(newSector);
            }
        }
        else {
            dir++;
            iSegments.reverse();
        }

        if (dir > 1)
            break;
    }

    return slicedSectors;
};

MapSector.prototype.area = function () {
    var sum = 0.0;

    for (var i = 0; i < this.segments.length; i++) {
        var segment = this.segments[i];

        sum += segment.ax * segment.by - segment.ay * segment.bx;
    }

    return sum * 0.5;
};

MapSector.prototype.visibleTags = function() {
    var tags = this.tags.slice(0);

    for(var i = 0; i < this.entities.length; i++) {
        tags = tags.concat(this.entities[i].tags);
    }

    return tags;
};

MapSector.prototype.clone = function () {
    var ns = MapSector.deserialize(this.serialize(), this.map);
    ns.id = "Sector_" + (new ObjectId().toString());
    return ns;
};

MapSector.prototype.serialize = function () {
    var r = EngineObject.prototype.serialize.call(this);

    r.version = this.version;
    r.bottomZ = this.bottomZ;
    r.topZ = this.topZ;
    r.floorMaterialId = this.floorMaterialId;
    r.ceilMaterialId = this.ceilMaterialId;
    r.center = this.center;
    r.min = this.min;
    r.max = this.max;
    r.lightmapWidth = this.lightmapWidth;
    r.lightmapHeight = this.lightmapHeight;
    r.floorScale = this.floorScale;
    r.ceilScale = this.ceilScale;
    r.hurt = this.hurt;
    r.floorTargetSectorId = this.floorTargetSectorId;
    r.ceilTargetSectorId = this.ceilTargetSectorId;
    r.segments = [];
    r.entities = [];

    for (var i = 0; i < this.segments.length; i++) {
        r.segments.push(this.segments[i].serialize());
    }

    for (var i = 0; i < this.entities.length; i++) {
        if (isA(this.entities[i], Player))
            continue;
        r.entities.push(this.entities[i].serialize());
    }

    return r;
};

MapSector.deserialize = function (data, map, sector) {
    sector = EngineObject.deserialize(data, sector);

    sector.bottomZ = data.bottomZ;
    sector.topZ = data.topZ;
    sector.floorMaterialId = data.floorMaterialId;
    sector.ceilMaterialId = data.ceilMaterialId;
    sector.center = vec3clone(data.center) || vec3blank();
    sector.min = vec3clone(data.min) || vec3blank();
    sector.max = vec3clone(data.max) || vec3blank();
    sector.lightmapWidth = data.lightmapWidth;
    sector.lightmapHeight = data.lightmapHeight;
    sector.floorScale = data.floorScale;
    sector.ceilScale = data.ceilScale;
    sector.hurt = data.hurt;
    sector.floorTargetSectorId = data.floorTargetSectorId;
    sector.ceilTargetSectorId = data.ceilTargetSectorId;
    sector.map = map;

    for (var i = 0; i < data.segments.length; i++) {
        if (i >= sector.segments.length)
            sector.segments.push(MapSegment.deserialize(data.segments[i], sector));
        else
            MapSegment.deserialize(data.segments[i], sector, sector.segments[i]);
    }
    if (sector.segments.length > data.segments.length)
        sector.segments.splice(data.segments.length, sector.segments.length - data.segments.length);

    for (var i = 0; i < data.entities.length; i++) {
        if (i >= sector.entities.length)
            sector.entities.push(classes[data.entities[i]._type].deserialize(data.entities[i], map));
        else
            sector.entities[i] = classes[data.entities[i]._type].deserialize(data.entities[i], map, sector.entities[i]);
        sector.entities[i].sector = sector;
    }
    if (sector.entities.length > data.entities.length)
        sector.entities.splice(data.entities.length, sector.entities.length - data.entities.length);

    if (!sector.floorLightmap || sector.floorLightmap.length != sector.lightmapWidth * sector.lightmapHeight * 3) {
        sector.update();
    }
    else if (sector.version != data.version) {
        sector.update();
        sector.version = data.version;
    }

    return sector;
};