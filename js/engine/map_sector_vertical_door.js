inherit(MapSector, MapSectorVerticalDoor);

function MapSectorVerticalDoor(options) {
    MapSector.call(this, options);

    this.oTopZ = this.topZ;
    this.velZ = 0.0;

    $.extend(true, this, options);

    this.oTopZ = this.topZ;
}

classes['MapSectorVerticalDoor'] = MapSectorVerticalDoor;

MapSectorVerticalDoor.editableProperties = MapSector.editableProperties;

MapSectorVerticalDoor.prototype.frame = function (lastFrameTime) {
    this.topZ += this.velZ * lastFrameTime / 30.0;

    if (this.topZ < this.bottomZ)
        this.topZ = this.bottomZ;
    if (this.topZ > this.oTopZ)
        this.topZ = this.oTopZ;

    this.velZ = -GAME_CONSTANTS.doorSpeed;
};

MapSectorVerticalDoor.prototype.actOnEntity = function (entity) {
    MapSector.prototype.actOnEntity.call(this, entity);

    if (distance2D(this.centerX, this.centerY, entity.pos[0], entity.pos[1]) < 100.0)
        this.velZ = GAME_CONSTANTS.doorSpeed;
};

MapSectorVerticalDoor.prototype.serialize = function () {
    var r = MapSector.prototype.serialize.call(this);

    r.oTopZ = this.oTopZ;
    r.velZ = this.velZ;

    return r;
};

MapSectorVerticalDoor.deserialize = function (data, map, sector) {
    sector = MapSector.deserialize(data, map, sector);

    sector.oTopZ = data.oTopZ;
    sector.velZ = data.velZ;

    return sector;
};