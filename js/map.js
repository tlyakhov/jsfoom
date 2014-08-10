function Map(options) {
    this.sectors = [];
    this.spawnx = 0;
    this.spawny = 0;

    $.extend(true, this, options);

    for (var i = 0; i < this.sectors.length; i++) {
        this.sectors[i].map = this;
    }
}
