MapSectorWater.prototype = new MapSector();
MapSectorWater.prototype.constructor = MapSectorWater;
MapSectorWater.prototype.parent = MapSector.prototype;

function MapSectorWater(options) {
    this.parent.constructor.call(this, options);

    $.extend(true, this, options);
}


MapSectorWater.prototype.actOnEntity = function (entity) {
    if (entity.constructor == Player) {
        entity.velX /= 4;
        entity.velY /= 4;
    }

    var ez = entity.constructor == Player ? entity.z + entity.height : entity.z;

    if (this.floorTargetSectorId) {
        if (ez > entity.sector.bottomZ) {
            entity.velZ -= 0.001;
        }
        else if (entity.z < entity.sector.bottomZ) {
            entity.sector = this.map.getSector(this.floorTargetSectorId);
            entity.z = entity.constructor == Player ? entity.sector.topZ - entity.height : entity.sector.topZ;
        }

    }
    else {
        if (entity.z > entity.sector.bottomZ) {
            entity.velZ -= 0.001;
        }
        else if (entity.z < entity.sector.bottomZ) {
            entity.velZ = 0;
            entity.z = entity.sector.bottomZ;
        }
    }

    if (this.ceilTargetSectorId) {
        if (ez > entity.sector.topZ) {
            entity.sector = this.map.getSector(this.ceilTargetSectorId);
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