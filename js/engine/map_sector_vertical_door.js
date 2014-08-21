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

    if (distance2D(this.centerX, this.centerY, entity.pos[0], entity.pos[1]) < 50.0)
        this.velZ = 3.0;
};