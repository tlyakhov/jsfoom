function MapSector(options) {
    // Defaults
    this.id = "Sector_" + (new ObjectId().toString());
    this.segments = [];
    this.map = null;
    this.bottomZ = 0;
    this.topZ = 64;
    this.floorMaterialId = "mat0";
    this.floorMaterial = null;
    this.ceilMaterialId = "mat0";
    this.ceilMaterial = null;
    this.centerX = 0.0;
    this.centerY = 0.0;
    this.floorScale = 256.0;
    this.ceilScale = 256.0;
    this.floorOx = 0;
    this.floorOy = 0;
    this.floorMx = 0;
    this.floorMy = 0;
    this.floorRot = 0;
    this.ceilOx = 0;
    this.ceilOy = 0;
    this.ceilMx = 0;
    this.ceilMy = 0;
    this.ceilRot = 0;
    this.flags = 0;
    this.floorTargetSectorId = null;
    this.ceilTargetSectorId = null;

    $.extend(true, this, options);

    this.update();
}

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

};

MapSector.prototype.actOnEntity = function (entity) {
    if (entity.sector.id != this.id)
        return;

    if (entity.constructor == Player) {
        entity.velX = 0;
        entity.velY = 0;
    }

    var ez = entity.constructor == Player ? entity.z + entity.height : entity.z;

    if (this.floorTargetSectorId) {
        if (ez > entity.sector.bottomZ) {
            entity.velZ -= 0.2;
        }
        else if (entity.z < entity.sector.bottomZ) {
            entity.sector.onExit(entity);
            entity.sector = this.map.getSector(this.floorTargetSectorId);
            entity.sector.onEnter(entity);
            entity.z = entity.constructor == Player ? entity.sector.topZ - entity.height : entity.sector.topZ;
        }

    }
    else {
        if (entity.z > entity.sector.bottomZ) {
            entity.velZ -= 0.2;
        }
        else if (entity.z < entity.sector.bottomZ) {
            entity.velZ = 0;
            entity.z = entity.sector.bottomZ;
        }
    }

    if (this.ceilTargetSectorId) {
        if (ez > entity.sector.topZ) {
            entity.sector.onExit(entity);
            entity.sector = this.map.getSector(this.ceilTargetSectorId);
            entity.sector.onEnter(entity);
            entity.z = entity.constructor == Player ? entity.sector.bottomZ - entity.height : entity.sector.bottomZ;
        }

    }
    else {
        if (ez >= entity.sector.topZ) {
            entity.velZ = 0;
            entity.z = entity.constructor == Player ? entity.sector.topZ - entity.height - 1.0 : entity.sector.bottomZ;
        }
    }
};

MapSector.prototype.onEnter = function (entity) {
};

MapSector.prototype.onExit = function (entity) {
};