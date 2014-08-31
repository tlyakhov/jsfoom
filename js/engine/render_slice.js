function RenderSlice() {
    this.renderTarget = null;
    this.x = 0;
    this.y = 0;
    this.yStart = 0;
    this.yEnd = 0;
    this.targetX = 0;
    this.sector = null;
    this.segment = null;
    this.ray = null;
    this.rayTable = 0;
    this.intersection = null;
    this.distance = 0.0;
    this.textureX = 0.0;
    this.seenPortals = {};
    this.world = null;
    this.normal = null;
    this.depth = 0;
    this.renderer = null;
}

RenderSlice.prototype.clone = function () {
    var s = _renderSliceCache.get();

    s.renderTarget = this.renderTarget;
    s.x = this.x;
    s.y = this.y;
    s.yStart = this.yStart;
    s.yEnd = this.yEnd;
    s.targetX = this.targetX;
    s.sector = this.sector;
    s.segment = this.segment;
    s.ray = this.ray;
    s.rayTable = this.rayTable;
    s.intersection = this.intersection;
    s.distance = this.distance;
    s.textureX = this.textureX;
    s.seenPortals = this.seenPortals;
    s.world = this.world;
    s.normal = this.normal;
    s.depth = this.depth;
    s.renderer = this.renderer;

    return s;
};

var _renderSliceCache = new ObjectCache(500, function () {
    return new RenderSlice();
});
