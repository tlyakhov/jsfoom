function Map(options) {
    this.id = null;
    this.sectors = [];
    this.materials = [];
    this.spawnX = 0;
    this.spawnY = 0;
    this.player = null;

    $.extend(true, this, options);

    if (!this.player)
        this.player = new Player({ pos: vec3create(this.spawnX, this.spawnY, 0.0), angle: 45, map: this });

    for (var i = 0; i < this.sectors.length; i++) {
        this.sectors[i].map = this;
    }

    for (var i = 0; i < this.materials.length; i++) {
        this.materials[i].map = this;
    }


}

classes['Map'] = Map;

Map.editableProperties = [
    { name: 'spawnX', friendly: 'Player Spawn X', type: 'float' },
    { name: 'spawnY', friendly: 'Player Spawn Y', type: 'float' }
];

Map.prototype.getMaterial = function (id) {
    for (var i = 0; i < this.materials.length; i++) {
        if (this.materials[i].id == id)
            return this.materials[i];
    }

    return undefined;
};

Map.prototype.getSector = function (id) {
    for (var i = 0; i < this.sectors.length; i++) {
        if (this.sectors[i].id == id)
            return this.sectors[i];
    }

    return undefined;
};

Map.prototype.frame = function (lastFrameTime) {
    this.player.frame(lastFrameTime);

    for (var i = 0; i < this.sectors.length; i++) {
        this.sectors[i].actOnEntity(this.player);
        this.sectors[i].frame(lastFrameTime);
    }
};

Map.prototype.serialize = function () {
    var r = {
        id: this.id,
        spawnX: this.spawnX,
        spawnY: this.spawnY,
        player: this.player.serialize(),
        sectors: [],
        materials: []
    };

    for (var i = 0; i < this.sectors.length; i++) {
        r.sectors.push(this.sectors[i].serialize());
    }

    for (var i = 0; i < this.materials.length; i++) {
        r.materials.push(this.materials[i].serialize());
    }

    return r;
};

Map.deserialize = function (data, map) {
    if (!map)
        map = new Map();

    map.id = data.id;
    map.spawnX = data.spawnX;
    map.spawnY = data.spawnY;

    for (var i = 0; i < data.sectors.length; i++) {
        if (i >= map.sectors.length)
            map.sectors.push(classes[data.sectors[i]._type].deserialize(data.sectors[i], map));
        else
            classes[data.sectors[i]._type].deserialize(data.sectors[i], map, map.sectors[i]);
    }

    if (map.sectors.length > data.sectors.length)
        map.sectors.splice(data.sectors.length, map.sectors.length - data.sectors.length);

    for (var i = 0; i < data.materials.length; i++) {
        if (i >= map.materials.length)
            map.materials.push(Material.deserialize(data.materials[i]));
        else
            Material.deserialize(data.materials[i], map.materials[i]);
        map.materials[i].map = map;
    }

    if (map.materials.length > data.materials.length)
        map.materials.splice(data.materials.length, map.materials.length - data.materials.length);

    Player.deserialize(data.player, map, map.player);

    map.player.updateSector();

    return map;
};

Map.prototype.stringSerialize = function () {
    var replacer = function (key, value) {
        var type = typeof2(value);

        if (type == '[object Float64Array]')
            return Array.apply([], value);
        else
            return value;
    };

    return JSON.stringify(this.serialize(), replacer);
};

Map.prototype.autoPortal = function (sectors) {
    if (!sectors)
        sectors = this.sectors;

    for (var m = 0; m < this.sectors.length; m++) {
        var mapSector2 = this.sectors[m];

        for (var i = 0; i < sectors.length; i++) {
            var mapSector = sectors[i];

            if (mapSector == mapSector2)
                continue;

            for (var j = 0; j < mapSector.segments.length; j++) {
                var mapSegment = mapSector.segments[j];

                for (var k = 0; k < mapSector2.segments.length; k++) {
                    var mapSegment2 = mapSector2.segments[k];

                    if (mapSegment.matches(mapSegment2)) {
                        mapSegment.adjacentSectorId = mapSector2.id;
                        mapSegment2.adjacentSectorId = mapSector.id;
                        mapSegment.midMaterialId = null;
                        mapSegment2.midMaterialId = null;
                    }
                }
            }
        }
    }
};

Map.prototype.clearLightmaps = function () {
    var index = this.sectors.length;

    while (index--)
        this.sectors[index].clearLightmaps();
};