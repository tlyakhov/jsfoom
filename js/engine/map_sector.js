function MapSector(options) {
    // Defaults
    this.id = "Sector_" + (new ObjectId().toString());
    this.segments = [];
    this.entities = [];
    this.map = null;
    this.bottomZ = 0;
    this.topZ = 64;
    this.floorMaterialId = "Default";
    this.floorMaterial = null;
    this.ceilMaterialId = "Default";
    this.ceilMaterial = null;
    this.centerX = 0.0;
    this.centerY = 0.0;
    this.floorScale = 64.0;
    this.ceilScale = 64.0;
    this.hurt = 0;
    this.floorTargetSectorId = null;
    this.ceilTargetSectorId = null;

    $.extend(true, this, options);

    if (this.segments.length > 0)
        this.update();
}

MapSector.editableProperties = [
    { name: 'id', friendly: 'ID', type: 'string' },
    { name: 'topZ', friendly: 'Ceiling Height', type: 'float' },
    { name: 'bottomZ', friendly: 'Floor Height', type: 'float' },
    { name: 'hurt', friendly: 'Hit points', type: 'float' },
    { name: 'floorScale', friendly: 'Floor Texture Scale', type: 'float' },
    { name: 'ceilScale', friendly: 'Ceiling Texture Scale', type: 'float' },
    { name: 'ceilMaterialId', friendly: 'Ceiling Material', type: 'material_id' },
    { name: 'floorMaterialId', friendly: 'Floor Material', type: 'material_id' }
];

classes['MapSector'] = MapSector;

MapSector.prototype.update = function () {
    this.centerX = 0.0;
    this.centerY = 0.0;
    for (var i = 0; i < this.segments.length; i++) {
        var next = i + 1 >= this.segments.length ? 0 : i + 1;
        this.centerX += this.segments[i].ax;
        this.centerY += this.segments[i].ay;
        this.segments[i].sector = this;
        this.segments[i].bx = this.segments[next].ax;
        this.segments[i].by = this.segments[next].ay;
        this.segments[i].update();
    }

    this.centerX /= this.segments.length;
    this.centerY /= this.segments.length;

    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].map = this.map;
        this.entities[i].sector = this;
    }
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

MapSector.prototype.frame = function (lastFrameTime) {
    for (var i = 0; i < this.entities.length; i++) {
        if (this.entities[i] == this.map.player)
            continue;

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

    entity.vel[2] -= GAME_CONSTANTS.gravity;

    this.collide(entity);
};

MapSector.prototype.onEnter = function (entity) {
    if (!this.floorTargetSectorId && entity.pos[2] <= entity.sector.bottomZ) {
        entity.vel[2] = 0;
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
            i++;
        }
    }

    if (intersections.length < 2)
        return [ this ];

    var comp = function (u, v) {
        return vec3dist(a, vec3create(u.ax, u.ay, 0, true)) - vec3dist(a, vec3create(v.ax, v.ay, 0, true));
    };

    iSegments.sort(comp);

    //console.log("Intersections: "+intersections.length, JSON.stringify(intersections));

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

MapSector.prototype.clone = function () {
    var ns = classes[this.constructor.name].deserialize(this.serialize(), this.map);
    ns.id = "Sector_" + (new ObjectId().toString());
    return ns;
};

MapSector.prototype.serialize = function () {
    var r = {
        _type: this.constructor.name,
        id: this.id,
        bottomZ: this.bottomZ,
        topZ: this.topZ,
        floorMaterialId: this.floorMaterialId,
        ceilMaterialId: this.ceilMaterialId,
        centerX: this.centerX,
        centerY: this.centerY,
        floorScale: this.floorScale,
        ceilScale: this.ceilScale,
        hurt: this.hurt,
        floorTargetSectorId: this.floorTargetSectorId,
        ceilTargetSectorId: this.ceilTargetSectorId,
        segments: [],
        entities: []
    };

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
    if (!sector)
        sector = createFromName(data._type, {});

    if (sector.constructor.name != data._type) {
        sector.__proto__ = classes[data._type];
    }

    sector.id = data.id;
    sector.bottomZ = data.bottomZ;
    sector.topZ = data.topZ;
    sector.floorMaterialId = data.floorMaterialId;
    sector.ceilMaterialId = data.ceilMaterialId;
    sector.centerX = data.centerX;
    sector.centerY = data.centerY;
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
            classes[data.entities[i]._type].deserialize(data.entities[i], map, sector.entities[i]);
    }
    if (sector.entities.length > data.entities.length)
        sector.entities.splice(data.entities.length, sector.entities.length - data.entities.length);

    return sector;
};