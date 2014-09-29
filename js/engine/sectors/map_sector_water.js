inherit(MapSector, MapSectorWater);

function MapSectorWater(options) {
    MapSector.call(this, options);

    $.extend(true, this, options);
}

classes['MapSectorWater'] = MapSectorWater;

MapSectorWater.editableProperties = MapSector.editableProperties;

MapSectorWater.prototype.actOnEntity = function (entity) {
    if (!entity.sector || entity.sector.id != this.id)
        return;

    if (entity.constructor == Player) {
        entity.vel[0] /= GAME_CONSTANTS.swimDamping;
        entity.vel[1] /= GAME_CONSTANTS.swimDamping;
    }

    if (entity.constructor.name != 'LightEntity') {
        entity.vel[2] /= GAME_CONSTANTS.swimDamping;
        entity.vel[2] -= GAME_CONSTANTS.gravitySwim;
    }

    this.collide(entity);
};

MapSectorWater.prototype.onEnter = function (entity) {
    MapSector.prototype.onEnter.call(this, entity);

    if (globalGame && entity.constructor == Player)
        globalGame.frameTint = 75 | 147 << 8 | 255 << 16 | 90 << 24;
};

MapSectorWater.prototype.onExit = function (entity) {
    MapSector.prototype.onExit.call(this, entity);

    if (globalGame && entity.constructor == Player)
        globalGame.frameTint = 0;
};

MapSectorWater.deserialize = function (data, map, sector) {
    return MapSector.deserialize(data, map, sector);
};