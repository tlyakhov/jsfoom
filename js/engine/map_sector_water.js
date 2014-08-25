inherit(MapSector, MapSectorWater);

function MapSectorWater(options) {
    this.parent.constructor.call(this, options);

    $.extend(true, this, options);
}

classes['MapSectorWater'] = MapSectorWater;

MapSectorWater.prototype.actOnEntity = function (entity) {
    if (entity.sector.id != this.id)
        return;

    if (entity.constructor == Player) {
        entity.vel[0] /= GAME_CONSTANTS.swimDamping;
        entity.vel[1] /= GAME_CONSTANTS.swimDamping;
    }

    entity.vel[2] /= GAME_CONSTANTS.swimDamping;
    entity.vel[2] -= GAME_CONSTANTS.gravitySwim;

    this.collide(entity);
};

MapSectorWater.prototype.onEnter = function (entity) {
    this.parent.onEnter.call(this, entity);

    if (globalGame && entity.constructor == Player)
        globalGame.frameTint = 75 | 147 << 8 | 255 << 16 | 90 << 24;
};

MapSectorWater.prototype.onExit = function (entity) {
    this.parent.onExit.call(this, entity);

    if (globalGame && entity.constructor == Player)
        globalGame.frameTint = 0;
};

MapSectorWater.deserialize = function (data, map, sector) {
    return MapSector.deserialize(data, map, sector);
};