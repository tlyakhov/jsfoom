function Map(options) {
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

classes['Map'] = Map

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

    for (var i = 0; i < map.sectors.length; i++) {
        map.sectors[i].actOnEntity(this.player);
        map.sectors[i].frame(lastFrameTime);
    }
};

Map.prototype.serialize = function () {
    var r = {
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

Map.deserialize = function (data) {
    var map = new Map({ spawnX: data.spawnX, spawnY: data.spawnY });

    for (var i = 0; i < data.sectors.length; i++) {
        map.sectors.push(classes[data.sectors[i]._type].deserialize(data.sectors[i], map));
    }

    for (var i = 0; i < data.materials.length; i++) {
        map.materials.push(Material.deserialize(data.materials[i]));
    }

    map.player = Player.deserialize(data.player, map);

    return map;
};