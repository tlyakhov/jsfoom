inherit(EngineObject, MapSegment);

function MapSegment(options) {
    EngineObject.call(this, options);
    
    this.ax = 0.0;
    this.ay = 0.0;
    this.bx = 0.0;
    this.by = 0.0;
    this.midMaterialId = 'Default';
    this.midMaterial = null;
    this.midBehavior = 'scaleWidth'; // or 'scaleHeight', 'scaleAll', or 'scaleNone'
    this.loMaterialId = 'Default';
    this.loMaterial = null;
    this.loBehavior = 'scaleWidth'; // or 'scaleHeight', 'scaleAll', or 'scaleNone'
    this.hiMaterialId = 'Default';
    this.hiMaterial = null;
    this.hiBehavior = 'scaleWidth'; // or 'scaleHeight', 'scaleAll', or 'scaleNone'
    this.length = 0;
    this.normal = vec3create(1.0, 0.0, 0.0);
    this.adjacentSectorId = null;
    this.adjacentSector = null;
    this.adjacentSegment = null;
    this.lightmap = null;
    this.lightmapWidth = 0;
    this.lightmapHeight = 0;

    this.flags = 0;
    this.sector = null;

    $.extend(true, this, options);

    this.update();
}

MapSegment.editableProperties = EngineObject.editableProperties.concat([
    { name: 'ax', friendly: 'X', type: 'float' },
    { name: 'ay', friendly: 'Y', type: 'float' },
    { name: 'midMaterialId', friendly: 'Middle Material', type: 'material_id' },
    { name: 'loMaterialId', friendly: 'Low Material', type: 'material_id' },
    { name: 'hiMaterialId', friendly: 'High Material', type: 'material_id' },
    { name: 'adjacentSectorId', friendly: 'Adjacent Sector ID', type: 'string' },
    { name: 'midBehavior', friendly: 'Middle Mapping', type: [ 'scaleNone', 'scaleWidth', 'scaleHeight', 'scaleAll']},
    { name: 'loBehavior', friendly: 'High Mapping', type: [ 'scaleNone', 'scaleWidth', 'scaleHeight', 'scaleAll']},
    { name: 'hiBehavior', friendly: 'Low Mapping', type: [ 'scaleNone', 'scaleWidth', 'scaleHeight', 'scaleAll']}
]);

classes['MapSegment'] = MapSegment;

MapSegment.prototype.update = function () {
    this.length = Math.sqrt(sqr((this.ax - this.bx)) + sqr((this.ay - this.by)));
    this.normal[0] = -(this.by - this.ay) / this.length;
    this.normal[1] = (this.bx - this.ax) / this.length;
    this.normal[2] = 0;
    if (this.sector) {
        this.lightmapWidth = fast_floor(this.length / GAME_CONSTANTS.lightGrid) + 2;
        this.lightmapHeight = fast_floor((this.sector.topZ - this.sector.bottomZ) / GAME_CONSTANTS.lightGrid) + 2;
        if(this.lightmap)
            deleteFloat64Array(this.lightmap);
        this.lightmap = newFloat64Array(this.lightmapWidth * this.lightmapHeight * 3);
        this.clearLightmap();
    }
};


MapSegment.prototype.clearLightmap = function () {
    var index = this.lightmap.length;
    while (index--)
        this.lightmap[index] = -1;
};

MapSegment.prototype.getMidMaterial = function () {
    if (!this.midMaterialId)
        return null;

    if (!this.midMaterial || this.midMaterial.id != this.midMaterialId)
        this.midMaterial = this.sector.map.getMaterial(this.midMaterialId);

    return this.midMaterial;
};

MapSegment.prototype.getHiMaterial = function () {
    if (!this.hiMaterialId)
        return null;

    if (!this.hiMaterial || this.hiMaterial.id != this.hiMaterialId)
        this.hiMaterial = this.sector.map.getMaterial(this.hiMaterialId);

    return this.hiMaterial;
};

MapSegment.prototype.getLoMaterial = function () {
    if (!this.loMaterialId)
        return null;

    if (!this.loMaterial || this.loMaterial.id != this.loMaterialId)
        this.loMaterial = this.sector.map.getMaterial(this.loMaterialId);

    return this.loMaterial;
};

var MapSegmentMatchEpsilon = 1e-4;
MapSegment.prototype.matches = function (s2) {
    return (Math.abs(this.ax - s2.ax) < MapSegmentMatchEpsilon && Math.abs(this.ay - s2.ay) < MapSegmentMatchEpsilon &&
        Math.abs(this.bx - s2.bx) < MapSegmentMatchEpsilon && Math.abs(this.by - s2.by) < MapSegmentMatchEpsilon) ||
        (Math.abs(this.ax - s2.bx) < MapSegmentMatchEpsilon && Math.abs(this.ay - s2.by) < MapSegmentMatchEpsilon &&
            Math.abs(this.bx - s2.ax) < MapSegmentMatchEpsilon && Math.abs(this.by - s2.ay) < MapSegmentMatchEpsilon);
};

MapSegment.prototype.getAdjacentSector = function () {
    if (!this.adjacentSectorId)
        return null;
    if (!this.sector.map || !this.sector.map.sectors)
        return null;

    if (!this.adjacentSector || this.adjacentSector.id != this.adjacentSectorId) {
        for (var i = 0; i < this.sector.map.sectors.length; i++) {
            var s = this.sector.map.sectors[i];
            if (this.adjacentSectorId == s.id) {
                this.adjacentSector = s;
                break;
            }
        }
    }

    return this.adjacentSector;
};

MapSegment.prototype.getAdjacentSegment = function () {
    if (!this.adjacentSectorId)
        return null;

    if (!this.adjacentSegment || this.adjacentSector.id != this.adjacentSectorId) {
        var adj = this.getAdjacentSector();

        if (!adj)
            return null;

        for (var i = 0; i < adj.segments.length; i++) {
            if (this.sector.id == adj.segments[i].adjacentSectorId && this.matches(adj.segments[i])) {
                this.adjacentSegment = adj.segments[i];
                break;
            }
        }
    }

    return this.adjacentSegment;
};

MapSegment.prototype.intersect = function (s2ax, s2ay, s2bx, s2by) {
    var s1 = this;
    var s1dx = s1.bx - s1.ax;
    var s1dy = s1.by - s1.ay;
    var s2dx = s2bx - s2ax;
    var s2dy = s2by - s2ay;

    var denom = s1dx * s2dy - s2dx * s1dy;
    if (denom == 0)
        return undefined;
    var r = (s1.ay - s2ay) * s2dx - (s1.ax - s2ax) * s2dy;
    if (denom <= 0 && r >= GAME_CONSTANTS.intersectEpsilon)
        return undefined;
    if (denom > 0 && r < -GAME_CONSTANTS.intersectEpsilon)
        return undefined;
    var s = (s1.ay - s2ay) * s1dx - (s1.ax - s2ax) * s1dy;
    if (denom <= 0 && s >= GAME_CONSTANTS.intersectEpsilon)
        return undefined;
    if (denom > 0 && s < -GAME_CONSTANTS.intersectEpsilon)
        return undefined;
    r /= denom;
    s /= denom;
    if (r > 1.0 + GAME_CONSTANTS.intersectEpsilon || s > 1.0 + GAME_CONSTANTS.intersectEpsilon)
        return undefined;

    r = Math.max(0.0, Math.min(1.0, r));

    return vec3create(s1.ax + r * s1dx, s1.ay + r * s1dy, 0.0, true);
};

MapSegment.prototype.aabbIntersect = function (xMin, yMin, xMax, yMax) {
    // Find min and max X for the segment

    var minX = this.ax;
    var maxX = this.bx;

    if (this.ax > this.bx) {
        minX = this.bx;
        maxX = this.ax;
    }

    // Find the intersection of the segment's and rectangle's x-projections

    if (maxX > xMax)
        maxX = xMax;

    if (minX < xMin)
        minX = xMin;

    if (minX > maxX) // If their projections do not intersect return false
        return false;

    // Find corresponding min and max Y for min and max X we found before
    var minY = this.ay;
    var maxY = this.by;
    var dx = this.bx - this.ax;

    if (Math.abs(dx) > 0.0000001) {
        var a = (this.by - this.ay) / dx;
        var b = this.ay - a * this.ax;
        minY = a * minX + b;
        maxY = a * maxX + b;
    }

    if (minY > maxY) {
        var tmp = maxY;
        maxY = minY;
        minY = tmp;
    }

    // Find the intersection of the segment's and rectangle's y-projections

    if (maxY > yMax)
        maxY = yMax;

    if (minY < yMin)
        minY = yMin;

    return minY <= maxY; // If Y-projections do not intersect return false
};

MapSegment.prototype.distanceToPoint2 = function (x, y) {
    var l2 = dist2(this.ax, this.ay, this.bx, this.by);
    if (l2 == 0)
        return dist2(x, y, this.ax, this.ay);
    var t = ((x - this.ax) * (this.bx - this.ax) + (y - this.ay) * (this.by - this.ay)) / l2;
    if (t < 0)
        return dist2(x, y, this.ax, this.ay);
    if (t > 1)
        return dist2(x, y, this.bx, this.by);
    return dist2(x, y, this.ax + t * (this.bx - this.ax), this.ay + t * (this.by - this.ay));
};

MapSegment.prototype.distanceToPoint = function (x, y) {
    return Math.sqrt(this.distanceToPoint2(x, y));
};

MapSegment.prototype.closestToPoint = function (x, y, pool) {
    var dx = (this.bx - this.ax);
    var dy = (this.by - this.ay);
    var dist2 = sqr(dx) + sqr(dy);

    if (dist2 == 0)
        return vec3create(this.ax, this.ay, 0, pool);

    var apx = x - this.ax;
    var apy = y - this.ay;
    var t = (apx * dx + apy * dy) / dist2;

    if (t < 0.0)
        return vec3create(this.ax, this.ay, 0, pool);
    if (t > 1.0)
        return vec3create(this.bx, this.by, 0, pool);

    return vec3create(this.ax + t * dx, this.ay + t * dy, 0, pool);
};

MapSegment.prototype.whichSide = function (x, y) {
    /*var dx = (this.bx - this.ax);
     var dy = (this.by - this.ay);

     return sign(dx * (y - this.ay) - dy * (x - this.ax));*/

    var dx = (x - this.ax);
    var dy = (y - this.ay);

    return this.normal[0] * dx + this.normal[1] * dy;

};

MapSegment.prototype.uvToWorld = function (u, v, pool) {
    return vec3create(this.ax + u * (this.bx - this.ax),
            this.ay + u * (this.by - this.ay),
            (1.0 - v) * this.sector.topZ + v * this.sector.bottomZ, pool);
};
MapSegment.prototype.lightmapAddressToWorld = function (mapIndex, pool) {
    var u = ((fast_floor(mapIndex / 3) % this.lightmapWidth) - 1) / (this.lightmapWidth - 2);
    var v = fast_floor(fast_floor(mapIndex / 3) / this.lightmapWidth - 1) / (this.lightmapHeight - 2);

    return this.uvToWorld(u, v, pool);
};

MapSegment.prototype.serialize = function () {
    var r = EngineObject.prototype.serialize.call(this);
    
    r.ax = this.ax;
    r.ay = this.ay;
    r.bx = this.bx;
    r.by = this.by;
    r.midMaterialId = this.midMaterialId;
    r.midBehavior = this.midBehavior;
    r.loMaterialId = this.loMaterialId;
    r.loBehavior = this.loBehavior;
    r.hiMaterialId = this.hiMaterialId;
    r.hiBehavior = this.hiBehavior;
    r.length = this.length;
    r.normal = this.normal;
    r.lightmapWidth = this.lightmapWidth;
    r.lightmapHeight = this.lightmapHeight;
    r.adjacentSectorId = this.adjacentSectorId;
    r.flags = this.flags;

    return r;
};

MapSegment.deserialize = function (data, sector, segment) {
    segment = EngineObject.deserialize(data, segment);

    segment.ax = data.ax;
    segment.ay = data.ay;
    segment.bx = data.bx;
    segment.by = data.by;
    segment.midMaterialId = data.midMaterialId;
    segment.midBehavior = data.midBehavior;
    segment.loMaterialId = data.loMaterialId;
    segment.loBehavior = data.loBehavior;
    segment.hiMaterialId = data.hiMaterialId;
    segment.hiBehavior = data.hiBehavior;
    segment.length = data.length;
    segment.normal[0] = data.normal[0];
    segment.normal[1] = data.normal[1];

    segment.lightmapWidth = data.lightmapWidth;
    segment.lightmapHeight = data.lightmapHeight;
    if (segment.adjacentSectorId != data.adjacentSectorId) {
        segment.adjacentSectorId = data.adjacentSectorId;
        segment.adjacentSector = null;
        segment.adjacentSegment = null;
    }
    segment.flags = data.flags;
    segment.sector = sector;

    return segment;
};

MapSegment.prototype.clone = function () {
    var ns = MapSegment.deserialize(this.serialize(), this.sector);
    ns.id = "Segment_" + (new ObjectId().toString());
    return ns;
};