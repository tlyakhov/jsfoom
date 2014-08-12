function RenderSlice() {
    this.renderTarget = null;
    this.x = 0;
    this.y = 0;
    this.yStart = 0;
    this.yEnd = 0;
    this.segment = null;
    this.ray = null;
    this.rayTable = 0;
    this.intersection = null;
    this.distance = 0.0;
    this.textureX = 0.0;
    this.seenPortals = {};
}

RenderSlice.prototype.clone = function () {
    var s = new RenderSlice();

    s.renderTarget = this.renderTarget;
    s.x = this.x;
    s.y = this.y;
    s.yStart = this.yStart;
    s.yEnd = this.yEnd;
    s.segment = this.segment;
    s.ray = this.ray;
    s.rayTable = this.rayTable;
    s.intersection = this.intersection;
    s.distance = this.distance;
    s.textureX = this.textureX;
    s.seenPortals = this.seenPortals;

    return s;
};