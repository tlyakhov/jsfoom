inherit(MapSector, MapSectorVerticalDoor);

function MapSectorVerticalDoor(options) {
    MapSector.call(this, options);

    this.oTopZ = this.topZ;
    this.velZ = 0;
    this.state = 'open';

    $.extend(true, this, options);

    this.oTopZ = this.topZ;
}

classes['MapSectorVerticalDoor'] = MapSectorVerticalDoor;

MapSectorVerticalDoor.editableProperties = MapSector.editableProperties;

MapSectorVerticalDoor.prototype.frame = function (lastFrameTime) {
    MapSector.prototype.frame.call(this, lastFrameTime);

    var last = this.topZ;

    this.topZ += this.velZ * lastFrameTime / 30.0;

    if (this.topZ < this.bottomZ) {
        this.topZ = this.bottomZ;
        this.velZ = 0;
        this.state = 'closed';
    }

    if (this.topZ > this.oTopZ) {
        this.topZ = this.oTopZ;
        this.velZ = 0;
        this.state = 'open';
    }

    if (last != this.topZ) {
        this.clearLightmaps();
        for (var key in this.pvs) {
            this.pvs[key].clearLightmaps();
        }
    }
};

MapSectorVerticalDoor.prototype.actOnEntity = function (entity) {
    MapSector.prototype.actOnEntity.call(this, entity);

    if (entity.constructor.name == 'LightEntity')
        return;

    if (distance2D(this.center[0], this.center[1], entity.pos[0], entity.pos[1]) < 100.0) {
        if (this.state != 'open') {
            this.velZ = GAME_CONSTANTS.doorSpeed;
            this.state = 'opening';
        }
    }
    else if (this.state == 'open') {
        this.velZ = -GAME_CONSTANTS.doorSpeed;
        this.state = 'closing';
    }
};

MapSectorVerticalDoor.prototype.serialize = function () {
    var r = MapSector.prototype.serialize.call(this);

    r.oTopZ = this.oTopZ;
    r.velZ = this.velZ;
    r.state = this.state;

    return r;
};

MapSectorVerticalDoor.deserialize = function (data, map, sector) {
    sector = MapSector.deserialize(data, map, sector);

    sector.oTopZ = data.oTopZ;
    sector.velZ = data.velZ;
    sector.state = data.state;

    return sector;
};