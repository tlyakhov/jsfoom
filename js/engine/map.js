inherit(EngineObject, Map);

function Map(options) {
    EngineObject.call(this, options);

    this.sectors = [];
    this.materials = [];
    this.spawnX = 0;
    this.spawnY = 0;
    this.player = null;
    this.entitiesPaused = false;

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

Map.editableProperties = EngineObject.editableProperties.concat([
    { name: 'spawnX', friendly: 'Player Spawn X', type: 'float' },
    { name: 'spawnY', friendly: 'Player Spawn Y', type: 'float' },
    { name: 'materials', friendly: 'Materials', type: 'array', childType: 'Material', parentReference: 'map' }
]);

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
        var sector = this.sectors[i];
        sector.actOnEntity(this.player);

        var j = sector.entities.length;
        while (j--) {
            if (!sector.entities[j].active)
                continue;

            for (var id in sector.pvsEntity) {
                sector.pvsEntity[id].actOnEntity(sector.entities[j]);
            }
        }

        this.sectors[i].frame(lastFrameTime);
    }
};

Map.prototype.light = function (world, normal, sector, segment, u, v, pool) {
    // Lightmap access
    var lightmap = null;
    var mapIndex00 = 0;
    var mapIndex10 = 0;
    var mapIndex11 = 0;
    var mapIndex01 = 0;
    var wu = 0.0;
    var wv = 0.0;
    var isWall = segment && normal[2] == 0;
    var q00 = null;

    // Optimize for our simple world geometry
    if (!isWall) {
        lightmap = normal[2] < 0 ? sector.ceilLightmap : sector.floorLightmap;
        mapIndex00 = sector.lightmapAddress(world);
        mapIndex10 = Math.min(mapIndex00 + 3, lightmap.length - 1);
        mapIndex11 = Math.min(mapIndex10 + 3 * sector.lightmapWidth, lightmap.length - 1);
        mapIndex01 = Math.min(mapIndex11 - 3, lightmap.length - 1);
        q00 = sector.lightmapWorld(world, true);
        wu = 1.0 - (world[0] - q00[0]) / GAME_CONSTANTS.lightGrid;
        wv = 1.0 - (world[1] - q00[1]) / GAME_CONSTANTS.lightGrid;
    }
    else {
        lightmap = segment.lightmap;
        wu = Math.min(fast_floor(u * (segment.lightmapWidth - 2)) + 1, segment.lightmapWidth - 1);
        wv = Math.min(fast_floor(v * (segment.lightmapHeight - 2)) + 1, segment.lightmapHeight - 1);
        var wu2 = Math.min(wu + 1, segment.lightmapWidth - 1);
        var wv2 = Math.min(wv + 1, segment.lightmapHeight - 1) * segment.lightmapWidth;
        wv *= segment.lightmapWidth;
        mapIndex00 = (wu + wv) * 3;
        mapIndex10 = (wu2 + wv) * 3;
        mapIndex11 = (wu2 + wv2) * 3;
        mapIndex01 = (wu + wv2) * 3;
        wu = u * (segment.lightmapWidth - 2);
        wv = v * (segment.lightmapHeight - 2);
        wu = 1.0 - (wu - fast_floor(wu));
        wv = 1.0 - (wv - fast_floor(wv));
    }

    wu = Math.min(1.0, Math.max(wu, 0.0));
    wv = Math.min(1.0, Math.max(wv, 0.0));

    if (lightmap[mapIndex00] < 0) {
        q00 = !isWall ? sector.lightmapAddressToWorld(mapIndex00, normal[2] > 0, false) : segment.lightmapAddressToWorld(mapIndex00, false);
        sector.calculateLighting(segment, normal, lightmap, mapIndex00, q00);
        //globalGame.renderer.counter++;
    }
    if (lightmap[mapIndex10] < 0) {
        var q10 = !isWall ? sector.lightmapAddressToWorld(mapIndex10, normal[2] > 0, false) : segment.lightmapAddressToWorld(mapIndex10, false);
        sector.calculateLighting(segment, normal, lightmap, mapIndex10, q10);
        // globalGame.renderer.counter++;
    }
    if (lightmap[mapIndex11] < 0) {
        var q11 = !isWall ? sector.lightmapAddressToWorld(mapIndex11, normal[2] > 0, false) : segment.lightmapAddressToWorld(mapIndex11, false);
        sector.calculateLighting(segment, normal, lightmap, mapIndex11, q11);
        //globalGame.renderer.counter++;
    }
    if (lightmap[mapIndex01] < 0) {
        var q01 = !isWall ? sector.lightmapAddressToWorld(mapIndex01, normal[2] > 0, false) : segment.lightmapAddressToWorld(mapIndex01, false);
        sector.calculateLighting(segment, normal, lightmap, mapIndex01, q01);
        //globalGame.renderer.counter++;
    }

    /*if(lightmap[mapIndex00] == undefined || lightmap[mapIndex01] == undefined || lightmap[mapIndex10] == undefined || lightmap[mapIndex11] == undefined) {
     console.log(mapIndex00 + ',' + lightmap.length);
     }*/

    //return vec3create(lightmap[mapIndex00 + 0], lightmap[mapIndex00 + 1], lightmap[mapIndex00 + 2], pool);

    return vec3create(lightmap[mapIndex00 + 0] * wu * wv +
            lightmap[mapIndex10 + 0] * (1.0 - wu) * wv +
            lightmap[mapIndex11 + 0] * (1.0 - wu) * (1.0 - wv) +
            lightmap[mapIndex01 + 0] * wu * (1.0 - wv),
            lightmap[mapIndex00 + 1] * wu * wv +
            lightmap[mapIndex10 + 1] * (1.0 - wu) * wv +
            lightmap[mapIndex11 + 1] * (1.0 - wu) * (1.0 - wv) +
            lightmap[mapIndex01 + 1] * wu * (1.0 - wv),
            lightmap[mapIndex00 + 2] * wu * wv +
            lightmap[mapIndex10 + 2] * (1.0 - wu) * wv +
            lightmap[mapIndex11 + 2] * (1.0 - wu) * (1.0 - wv) +
            lightmap[mapIndex01 + 2] * wu * (1.0 - wv), pool);
};

Map.prototype.resetAllEntities = function () {
    for (var i = 0; i < this.sectors.length; i++) {
        var entities = this.sectors[i].entities.slice(0);

        for (var j = 0; j < entities.length; j++) {
            var entity = entities[j];

            for (var k = 0; k < entity.behaviors.length; k++) {
                entity.behaviors[k].reset();
            }
        }
    }
};

Map.prototype.serialize = function () {
    var r = EngineObject.prototype.serialize.call(this);

    r.spawnX = this.spawnX;
    r.spawnY = this.spawnY;
    r.player = this.player.serialize();
    r.sectors = [];
    r.materials = [];

    for (var i = 0; i < this.sectors.length; i++) {
        r.sectors.push(this.sectors[i].serialize());
    }

    for (var i = 0; i < this.materials.length; i++) {
        r.materials.push(this.materials[i].serialize());
    }

    return r;
};

Map.deserialize = function (data, map) {
    map = EngineObject.deserialize(data, map);

    map.spawnX = data.spawnX;
    map.spawnY = data.spawnY;

    for (var i = 0; i < data.sectors.length; i++) {
        if (i >= map.sectors.length)
            map.sectors.push(classes[data.sectors[i]._type].deserialize(data.sectors[i], map));
        else
            map.sectors[i] = classes[data.sectors[i]._type].deserialize(data.sectors[i], map, map.sectors[i]);
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

    map.player.collide();

    return map;
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

                if (mapSegment.adjacentSectorId && (!mapSegment.getAdjacentSegment() || !mapSegment.matches(mapSegment.getAdjacentSegment()))) {
                    mapSegment.adjacentSectorId = null;
                    if (!mapSegment.midMaterialId)
                        mapSegment.midMaterialId = 'Default';
                }
            }
        }
    }

    for (var i = 0; i < sectors.length; i++) {
        sectors[i].update();
    }
};

Map.prototype.clearLightmaps = function () {
    var index = this.sectors.length;

    while (index--)
        this.sectors[index].clearLightmaps();
};

Map.prototype.visibleTags = function() {
    var tags = [];
    for(var i = 0; i < this.sectors.length; i++) {
        tags = tags.concat(this.sectors[i].visibleTags());
    }

    return tags;
};