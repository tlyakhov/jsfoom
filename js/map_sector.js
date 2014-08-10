function MapSector(options) {
    // Defaults
    this.id = "Sector_" + (new ObjectId().toString());
    this.segments = [];
    this.bottomZ = 0;
    this.topZ = 64;
    this.floorTexSrc = "data/grass.jpg";
    this.floorTex = null;
    this.ceilTexSrc = "data/ceil.jpg";
    this.ceilTex = null;
    this.floorScale = 256.0;
    this.ceilScale = 256.0;
    this.floorOx = 0;
    this.floorOy = 0;
    this.floorMx = 0;
    this.floorMy = 0;
    this.floorRot = 0;
    this.ceilOx = 0;
    this.ceilOy = 0;
    this.ceilMx = 0;
    this.ceilMy = 0;
    this.ceilRot = 0;
    this.flags = 0;

    $.extend(true, this, options);

    this.update();
}

MapSector.prototype.update = function () {
    for (var i = 0; i < this.segments.length; i++) {
        var next = i + 1 >= this.segments.length ? 0 : i + 1;
        this.segments[i].sector = this;
        this.segments[i].bx = this.segments[next].ax;
        this.segments[i].by = this.segments[next].ay;
        this.segments[i].update();
    }

    this.floorTex = textureCache.get(this.floorTexSrc, true);
    this.ceilTex = textureCache.get(this.ceilTexSrc, true);
};

MapSector.prototype.isPointInside = function (x, y) {
    var inside = false;
    var flag1 = (y >= this.segments[0].ay);
    var j = 1;

    for (var i = 0; i < this.segments.length; i++) {
        flag2 = (y >= this.segments[j].ay);
        if (flag1 != flag2) {
            if (((this.segments[j].ay - y) * (this.segments[i].ax - this.segments[j].ax) >=
                (this.segments[j].ax - x) * (this.segments[i].ay - this.segments[j].ay)) == flag2) {
                inside = !inside;
            }
        }
        flag1 = flag2;
        j++;
        if (j == this.segments.length)
            j = 0;
    }

    return inside;
};