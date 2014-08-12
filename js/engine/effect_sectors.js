MapSectorWater.prototype = new MapSector();
MapSectorWater.prototype.constructor = MapSectorWater;
MapSectorWater.prototype.parent = MapSector.prototype;

function MapSectorWater(options) {
    this.parent.constructor.call(this, options);

    $.extend(true, this, options);
}


MapSectorWater.prototype.actOnEntity = function (entity) {
    if (entity.sector.id != this.id)
        return;

    if (entity.constructor == Player) {
        entity.velX /= 4;
        entity.velY /= 4;
    }

    var ez = entity.constructor == Player ? entity.z + entity.height : entity.z;

    if (this.floorTargetSectorId) {
        if (ez > entity.sector.bottomZ) {
            entity.velZ -= 0.0001;
        }
        else if (entity.z < entity.sector.bottomZ) {
            entity.sector.onExit(entity);
            entity.sector = this.map.getSector(this.floorTargetSectorId);
            entity.sector.onEnter(entity);
            entity.z = entity.constructor == Player ? entity.sector.topZ - entity.height - 1.0 : entity.sector.topZ - 1.0;
        }

    }
    else {
        if (entity.z > entity.sector.bottomZ) {
            entity.velZ -= 0.0001;
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
            entity.z = entity.constructor == Player ? entity.sector.bottomZ - entity.height + 1.0 : entity.sector.bottomZ + 1.0;
        }

    }
    else {
        if (ez >= entity.sector.topZ) {
            entity.velZ = 0;
            entity.z = entity.constructor == Player ? entity.sector.topZ - entity.height - 1.0 : entity.sector.bottomZ;
        }
    }
};

MapSectorWater.prototype.onEnter = function (entity) {
    this.parent.onEnter.call(this, entity);

    if (entity.constructor == Player)
        renderer.frameTint = 75 | 147 << 8 | 255 << 16 | 90 << 24;
};

MapSectorWater.prototype.onExit = function (entity) {
    this.parent.onExit.call(this, entity);

    if (entity.constructor == Player)
        renderer.frameTint = 0;
};

MapSectorVerticalDoor.prototype = new MapSector();
MapSectorVerticalDoor.prototype.constructor = MapSectorVerticalDoor;
MapSectorVerticalDoor.prototype.parent = MapSector.prototype;

function MapSectorVerticalDoor(options) {
    this.parent.constructor.call(this, options);

    this.oTopZ = this.topZ;
    this.velZ = 0.0;

    $.extend(true, this, options);

    this.oTopZ = this.topZ;
}

MapSectorVerticalDoor.prototype.frame = function (lastFrameTime) {
    this.topZ += this.velZ * lastFrameTime / 30.0;

    if (this.topZ < this.bottomZ)
        this.topZ = this.bottomZ;
    if (this.topZ > this.oTopZ)
        this.topZ = this.oTopZ;

    this.velZ = -3.0;
};

MapSectorVerticalDoor.prototype.actOnEntity = function (entity) {
    this.parent.actOnEntity.call(this, entity);

    if (distance2D(this.centerX, this.centerY, entity.x, entity.y) < 50.0)
        this.velZ = 3.0;
};