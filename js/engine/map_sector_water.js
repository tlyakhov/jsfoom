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
        entity.velX /= GAME_CONSTANTS.swimDamping;
        entity.velY /= GAME_CONSTANTS.swimDamping;
    }

    entity.velZ /= GAME_CONSTANTS.swimDamping;
    entity.velZ -= GAME_CONSTANTS.gravitySwim;

    this.collide(entity);
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