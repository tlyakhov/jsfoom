function Map(options) {
    this.sectors = [];
    this.materials = [];
    this.spawnx = 0;
    this.spawny = 0;

    $.extend(true, this, options);

    for (var i = 0; i < this.sectors.length; i++) {
        this.sectors[i].map = this;
    }

    for (var i = 0; i < this.materials.length; i++) {
        this.materials[i].map = this;
    }

    this.player = new Player({ x: this.spawnx, y: this.spawny, angle: 45, map: this });

}

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
}