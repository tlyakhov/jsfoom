function Renderer(options) {
    this.canvas = null;
    this.screenWidth = 640;
    this.screenHeight = 360;
    this.fov = GAME_CONSTANTS.fieldOfView;
    this.maxViewDist = GAME_CONSTANTS.maxViewDistance;
    this.frame = 0;
    this.frameTint = 0;
    this.frameSectors = {};
    this.workerWidth = 0;

    $.extend(true, this, options);

    this.workerWidth = (globalWorkerId != undefined) ? this.screenWidth / globalWorkersTotal : this.screenWidth;

    if (this.canvas && !options.screenWidth) {
        this.screenWidth = $(this.canvas).width();
        this.screenHeight = $(this.canvas).height();
    }

    this.initTables();
}

Renderer.prototype.initTables = function () {
    this.cameraToProjectionPlane = (this.screenWidth / 2.0) / Math.tan(this.fov * deg2rad / 2.0);
    this.trigCount = fast_floor(this.screenWidth * 360.0 / this.fov); // Quantize trig tables per-pixel.
    this.trigTable = [];
    this.viewFix = [];

    for (var i = 0; i < this.trigCount; i++) {
        this.trigTable[i] = {
            sin: Math.sin(i * 2.0 * Math.PI / this.trigCount),
            cos: Math.cos(i * 2.0 * Math.PI / this.trigCount)
        };
    }

    for (var i = 0; i < this.screenWidth / 2; i++) {
        this.viewFix[i] = this.cameraToProjectionPlane / this.trigTable[this.screenWidth / 2 - 1 - i].cos;
        this.viewFix[(this.screenWidth - 1) - i] = this.viewFix[i];
    }

    this.zbuffer = new Float64Array(this.workerWidth * this.screenHeight);
};

Renderer.prototype.renderFloor = function (slice, start, end) {
    var sector = slice.segment.sector;
    var floorMaterial = sector.getFloorMaterial();
    var th = floorMaterial.getTexture().height;

    slice.normal = vec3create(0.0, 0.0, 1.0, true);
    slice.world = vec3create(0.0, 0.0, sector.bottomZ, true);

    for (slice.y = start; slice.y < end; slice.y++) {
        if (slice.y - this.screenHeight / 2 == 0)
            continue;

        var distToFloor = (-sector.bottomZ + (this.map.player.pos[2] + this.map.player.height)) * this.viewFix[slice.x] / (slice.y - this.screenHeight / 2);
        var scaler = th * sector.floorScale / distToFloor;
        var screenIndex = slice.targetX + slice.y * this.workerWidth;

        if (distToFloor < this.zbuffer[screenIndex]) {
            slice.world[0] = this.map.player.pos[0] + this.trigTable[slice.rayTable].cos * distToFloor;
            slice.world[1] = this.map.player.pos[1] + this.trigTable[slice.rayTable].sin * distToFloor;


            var tx = slice.world[0] / sector.floorScale - fast_floor(slice.world[0] / sector.floorScale);
            var ty = slice.world[1] / sector.floorScale - fast_floor(slice.world[1] / sector.floorScale);

            if (tx < 0)
                tx = tx + 1.0;
            if (ty < 0)
                ty = ty + 1.0;

            slice.renderTarget[screenIndex] = floorMaterial.sample(slice, tx, ty, scaler);
            this.zbuffer[screenIndex] = distToFloor;
        }
    }
};

Renderer.prototype.renderCeiling = function (slice, start, end) {
    var sector = slice.segment.sector;
    var ceilMaterial = sector.getCeilMaterial();
    var th = ceilMaterial.getTexture().height;

    slice.normal = vec3create(0.0, 0.0, -1.0, true);
    slice.world = vec3create(0.0, 0.0, sector.topZ, true);

    for (slice.y = start; slice.y < end; slice.y++) {
        var distToCeiling = (sector.topZ - (this.map.player.pos[2] + this.map.player.height)) * this.viewFix[slice.x] / (this.screenHeight / 2 - 1 - slice.y);
        var scaler = th * sector.ceilScale / distToCeiling;
        var screenIndex = slice.targetX + slice.y * this.workerWidth;

        if (distToCeiling < this.zbuffer[screenIndex]) {
            slice.world[0] = this.map.player.pos[0] + this.trigTable[slice.rayTable].cos * distToCeiling;
            slice.world[1] = this.map.player.pos[1] + this.trigTable[slice.rayTable].sin * distToCeiling;

            var tx = Math.abs(slice.world[0] / sector.ceilScale - fast_floor(slice.world[0] / sector.ceilScale));
            var ty = Math.abs(slice.world[1] / sector.ceilScale - fast_floor(slice.world[1] / sector.ceilScale));

            if (tx < 0)
                tx = tx + 1.0;
            if (ty < 0)
                ty = ty + 1.0;

            slice.renderTarget[screenIndex] = ceilMaterial.sample(slice, tx, ty, scaler);
            this.zbuffer[screenIndex] = distToCeiling;
        }
    }
};

Renderer.prototype.renderSlice = function (slice) {
    var segment = slice.segment;
    var sector = slice.segment.sector;
    var projectedHeightTop = (sector.topZ - (this.map.player.pos[2] + this.map.player.height)) * this.viewFix[slice.x] / slice.distance;
    var projectedHeightBottom = (sector.bottomZ - (this.map.player.pos[2] + this.map.player.height)) * this.viewFix[slice.x] / slice.distance;

    var sliceStart = fast_floor(this.screenHeight / 2 - projectedHeightTop);
    var sliceEnd = fast_floor(this.screenHeight / 2 - projectedHeightBottom);
    var clippedStart = fast_floor(Math.max(sliceStart, slice.yStart));
    var clippedEnd = fast_floor(Math.min(sliceEnd, slice.yEnd));

    this.renderCeiling(slice, slice.yStart, clippedStart);
    this.renderFloor(slice, clippedEnd, slice.yEnd);

    slice.world[0] = slice.intersection[0];
    slice.world[1] = slice.intersection[1];
    slice.normal = vec3create(segment.normalX, segment.normalY, 0.0, true);

    if (segment.adjacentSectorId) {
        var adj = segment.getAdjacentSector();

        if (!adj)
            return;

        var adjSegment = segment.getAdjacentSegment();

        if (!adjSegment)
            return;

        var hiMaterial = adjSegment.getHiMaterial();
        var loMaterial = adjSegment.getLoMaterial();

        var adjProjectedHeightTop = (adj.topZ - (this.map.player.pos[2] + this.map.player.height)) * this.viewFix[slice.x] / slice.distance;
        var adjProjectedHeightBottom = (adj.bottomZ - (this.map.player.pos[2] + this.map.player.height)) * this.viewFix[slice.x] / slice.distance;

        var adjSliceTop = fast_floor(this.screenHeight / 2 - adjProjectedHeightTop);
        var adjSliceBottom = fast_floor(this.screenHeight / 2 - adjProjectedHeightBottom);
        var adjClippedTop = fast_floor(Math.max(adjSliceTop, clippedStart));
        var adjClippedBottom = fast_floor(Math.min(adjSliceBottom, clippedEnd));

        if (hiMaterial) {
            for (slice.y = clippedStart; slice.y < adjClippedTop; slice.y++) {
                var screenIndex = slice.targetX + slice.y * this.workerWidth;
                if (slice.distance < this.zbuffer[screenIndex]) {
                    var ty = (slice.y - sliceStart) / (adjSliceTop - sliceStart);
                    slice.world[2] = sector.topZ - ty * (sector.topZ - adj.topZ);
                    if (adjSegment.hiBehavior == 'scaleWidth' || adjSegment.hiBehavior == 'scaleNone')
                        ty = (ty * (adj.topZ - sector.topZ) - adj.topZ) / 64.0;

                    slice.renderTarget[screenIndex] = hiMaterial.sample(slice, slice.textureX, ty, adjSliceTop - sliceStart);
                    this.zbuffer[screenIndex] = slice.distance;
                }
            }
        }

        if (loMaterial) {
            for (slice.y = adjClippedBottom; slice.y < clippedEnd; slice.y++) {
                var screenIndex = slice.targetX + slice.y * this.workerWidth;
                if (slice.distance < this.zbuffer[screenIndex]) {
                    var ty = (slice.y - adjClippedBottom) / (sliceEnd - adjSliceBottom);
                    slice.world[2] = adj.bottomZ - ty * (adj.bottomZ - sector.bottomZ);
                    if (adjSegment.loBehavior == 'scaleWidth' || adjSegment.loBehavior == 'scaleNone')
                        ty = (ty * (sector.bottomZ - adj.bottomZ) - sector.bottomZ) / 64.0;

                    slice.renderTarget[screenIndex] = loMaterial.sample(slice, slice.textureX, ty, sliceEnd - adjSliceBottom);
                    this.zbuffer[screenIndex] = slice.distance;
                }
            }
        }

        var portalSlice = slice.clone();
        portalSlice.sector = adj;
        portalSlice.yStart = adjClippedTop;
        portalSlice.yEnd = adjClippedBottom;
        //portalSlice.seenPortals = {};
        portalSlice.seenPortals[segment.id] = true;
        portalSlice.seenPortals[adjSegment.id] = true;
        portalSlice.depth++;
        this.renderSector(portalSlice);
    }
    else {
        var midMaterial = segment.getMidMaterial();

        if (!midMaterial)
            return;

        for (slice.y = clippedStart; slice.y < clippedEnd; slice.y++) {
            var screenIndex = slice.targetX + slice.y * this.workerWidth;
            if (slice.distance < this.zbuffer[screenIndex]) {
                var ty = (slice.y - sliceStart) / (sliceEnd - sliceStart);
                slice.world[2] = sector.topZ + ty * (sector.bottomZ - sector.topZ);
                if (segment.midBehavior == 'scaleWidth' || segment.midBehavior == 'scaleNone')
                    ty = (ty * (sector.topZ - sector.bottomZ) - sector.topZ) / 64.0;

                slice.renderTarget[screenIndex] = midMaterial.sample(slice, slice.textureX, ty, sliceEnd - sliceStart);
                this.zbuffer[screenIndex] = slice.distance;
            }
        }
    }
};

Renderer.prototype.renderSector = function (slice) {
    this.frameSectors[slice.sector.id] = slice.sector;

    slice.distance = GAME_CONSTANTS.maxViewDistance;

    var dist = null;

    for (var j = 0; j < slice.sector.segments.length; j++) {
        var segment = slice.sector.segments[j];

        if (slice.seenPortals[segment.id])
            continue;

        var isect = segment.intersect(slice.ray[0], slice.ray[1], slice.ray[2], slice.ray[3]);

        if (isect == undefined)
            continue;

        var dx = Math.abs(isect[0] - this.map.player.pos[0]);
        var dy = Math.abs(isect[1] - this.map.player.pos[1]);

        if (dy > dx)
            dist = Math.abs(dy / this.trigTable[slice.rayTable].sin);
        else
            dist = Math.abs(dx / this.trigTable[slice.rayTable].cos);

        if (dist > slice.distance)
            continue;

        slice.segment = segment;
        slice.distance = dist;
        slice.intersection = isect;
        slice.textureX = Math.sqrt(sqr((slice.intersection[0] - slice.segment.ax)) +
            sqr((slice.intersection[1] - slice.segment.ay))) / slice.segment.length; // 0.0 - 1.0
    }

    if (dist)
        this.renderSlice(slice);
    else
        console.log('depth: ' + slice.depth + ', sector: ' + slice.sector.id);
};

Renderer.prototype.renderEntity = function (renderTarget, entity) {
    var etop = this.map.player.angleTo(entity.pos[0], entity.pos[1]);
    var ang = etop - this.map.player.angle;

    if (ang < -this.fov / 2)
        ang += 360.0;
    if (ang > this.fov / 2)
        ang -= 360.0;

    var sprite = entity.getSprite(normalizeAngle(360 - etop + entity.angle));

    if (!sprite)
        return;

    var texture = sprite.getTexture();

    if (!texture)
        return;

    var d = this.map.player.distanceTo(entity.pos[0], entity.pos[1]);
    var x = (ang + this.fov / 2.0) * this.screenWidth / this.fov;
    var vfixindex = Math.min(Math.max(fast_floor(x), 0), this.screenWidth - 1);
    var z = entity.pos[2] + entity.zOffset - (this.map.player.pos[2] + this.map.player.height);
    var y1 = fast_floor(this.screenHeight / 2 - (z + entity.height) * this.viewFix[vfixindex] / d);
    var y2 = fast_floor(this.screenHeight / 2 - z * this.viewFix[vfixindex] / d);

    var scale = (y2 - y1) * entity.width / entity.height;
    var x1 = fast_floor(x - scale * 0.5);
    var x2 = fast_floor(x + scale * 0.5);

    var xStart = (globalWorkerId != undefined) ? globalWorkerId * this.workerWidth : 0;
    var xEnd = (globalWorkerId != undefined) ? xStart + this.workerWidth : this.screenWidth;
    var clippedX1 = Math.max(x1, xStart);
    var clippedX2 = Math.min(x2, xEnd);
    var clippedY1 = Math.max(y1, 0);
    var clippedY2 = Math.min(y2, this.screenHeight - 1);
    for (var x = clippedX1; x < clippedX2; x++) {
        for (var y = clippedY1; y < clippedY2; y++) {
            var screenIndex = y * this.workerWidth + x - xStart;
            if (d < this.zbuffer[screenIndex]) {
                var pixel = texture.sample((x - x1) / scale, (y - y1) / (y2 - y1), y2 - y1);
                if (((pixel >> 24) & 0xFF) > 0) {
                    renderTarget[screenIndex] = colorTint(renderTarget[screenIndex], pixel);
                    this.zbuffer[screenIndex] = d;
                }
            }
        }
    }
};

Renderer.prototype.render = function (renderTarget) {
    this.frameSectors = {};

    var xStart = (globalWorkerId != undefined) ? globalWorkerId * this.workerWidth : 0;
    var xEnd = (globalWorkerId != undefined) ? xStart + this.workerWidth : this.screenWidth;

    for (var x = xStart; x < xEnd; x++) {
        for (var i = 0; i < this.screenHeight; i++) {
            this.zbuffer[i * this.workerWidth + x - xStart] = this.maxViewDist;
        }

        var slice = _renderSliceCache.get();

        slice.renderer = this;
        slice.depth = 0;
        slice.seenPortals = {};
        slice.renderTarget = renderTarget;
        slice.x = x;
        slice.targetX = x - xStart;
        slice.yStart = 0;
        slice.yEnd = this.screenHeight - 1;
        //slice.rayAngle = normalizeAngle(map.player.angle + (x * this.fov) / (this.screenWidth - 1) - (this.fov / 2.0));
        slice.rayTable = fast_floor(this.map.player.angle * this.trigCount / 360.0) + x - this.screenWidth / 2 + 1;
        while (slice.rayTable < 0)
            slice.rayTable += this.trigCount;

        while (slice.rayTable >= this.trigCount)
            slice.rayTable -= this.trigCount;

        slice.ray = [ this.map.player.pos[0], this.map.player.pos[1],
                this.map.player.pos[0] + this.maxViewDist * this.trigTable[slice.rayTable].cos,
                this.map.player.pos[1] + this.maxViewDist * this.trigTable[slice.rayTable].sin];

        slice.sector = this.map.player.sector;

        if (!slice.sector)
            continue;

        this.renderSector(slice);
    }

    for (var sid in this.frameSectors) {
        var sector = this.frameSectors[sid];

        for (var i = 0; i < sector.entities.length; i++) {
            if (isA(sector.entities[i], RenderableEntity))
                this.renderEntity(renderTarget, sector.entities[i]);
        }
    }

    this.frame++;
};