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
        this.entities[i].map = this;
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

    if (fm.hurt > 0 && entity.pos[2] <= this.bottomZ && entity.hurtTime == 0) {
        entity.hurt(fm.hurt);
    }

    var cm = this.getCeilMaterial();

    if (cm.hurt > 0 && entityTop >= this.topZ && entity.hurtTime == 0) {
        entity.hurt(cm.hurt);
    }


};

MapSector.prototype.actOnEntity = function (entity) {
    if (entity.sector.id != this.id)
        return;

    if (entity.constructor == Player) {
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
        r.entities.push(this.entities[i].serialize());
    }

    return r;
};

MapSector.deserialize = function (data, map) {
    var mapSector = createFromName(data._type, {
        id: data.id,
        bottomZ: data.bottomZ,
        topZ: data.topZ,
        floorMaterialId: data.floorMaterialId,
        ceilMaterialId: data.ceilMaterialId,
        centerX: data.centerX,
        centerY: data.centerY,
        floorScale: data.floorScale,
        ceilScale: data.ceilScale,
        hurt: data.hurt,
        floorTargetSectorId: data.floorTargetSectorId,
        ceilTargetSectorId: data.ceilTargetSectorId,
        map: map
    });

    for (var i = 0; i < data.segments.length; i++) {
        mapSector.segments.push(MapSegment.deserialize(data.segments[i], mapSector));
    }

    for (var i = 0; i < data.entities.length; i++) {
        mapSector.entities.push(classes[data.entities[i]._type].deserialize(data.entities[i], map));
    }

    return mapSector;
};