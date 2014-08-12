function Renderer(options) {
    this.canvas = '';
    this.screenWidth = 640;
    this.screenHeight = 360;
    this.fov = GAME_CONSTANTS.fieldOfView;
    this.maxViewDist = GAME_CONSTANTS.maxViewDistance;
    this.frame = 0;
    this.frameTint = 0;

    $.extend(true, this, options);

    this.screenWidth = $(this.canvas).width();
    this.screenHeight = $(this.canvas).height();

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

    this.zbuffer = new Array(this.screenWidth * this.screenHeight);
}

Renderer.prototype.renderFloor = function (slice, start, end) {
    var sector = slice.segment.sector;
    var floorMaterial = sector.getFloorMaterial();
    var th = floorMaterial.getTexture().height;

    for (slice.y = start; slice.y < end; slice.y++) {
        if (slice.y - this.screenHeight / 2 == 0)
            continue;

        var distToFloor = (-sector.bottomZ + (map.player.z + map.player.height)) * this.viewFix[slice.x] / (slice.y - this.screenHeight / 2);
        var scaler = th * sector.floorScale / distToFloor;
        var screenIndex = slice.x + slice.y * this.screenWidth;

        if (distToFloor < this.zbuffer[screenIndex]) {
            var floorX = map.player.x + this.trigTable[slice.rayTable].cos * distToFloor;
            var floorY = map.player.y + this.trigTable[slice.rayTable].sin * distToFloor;

            var tx = floorX / sector.floorScale - fast_floor(floorX / sector.floorScale);
            var ty = floorY / sector.floorScale - fast_floor(floorY / sector.floorScale);

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

    for (slice.y = start; slice.y < end; slice.y++) {
        var distToCeiling = (sector.topZ - (map.player.z + map.player.height)) * this.viewFix[slice.x] / (this.screenHeight / 2 - 1 - slice.y);
        var scaler = th * sector.ceilScale / distToCeiling;
        var screenIndex = slice.x + slice.y * this.screenWidth;

        if (distToCeiling < this.zbuffer[screenIndex]) {
            var ceilingX = map.player.x + this.trigTable[slice.rayTable].cos * distToCeiling;
            var ceilingY = map.player.y + this.trigTable[slice.rayTable].sin * distToCeiling;

            var tx = Math.abs(ceilingX / sector.ceilScale - fast_floor(ceilingX / sector.ceilScale));
            var ty = Math.abs(ceilingY / sector.ceilScale - fast_floor(ceilingY / sector.ceilScale));

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
    var projectedHeightTop = (sector.topZ - (map.player.z + map.player.height)) * this.viewFix[slice.x] / slice.distance;
    var projectedHeightBottom = (sector.bottomZ - (map.player.z + map.player.height)) * this.viewFix[slice.x] / slice.distance;

    var sliceStart = fast_floor(this.screenHeight / 2 - projectedHeightTop);
    var sliceEnd = fast_floor(this.screenHeight / 2 - projectedHeightBottom);
    var clippedStart = fast_floor(Math.max(sliceStart, slice.yStart));
    var clippedEnd = fast_floor(Math.min(sliceEnd, slice.yEnd));

    this.renderCeiling(slice, slice.yStart, clippedStart);
    this.renderFloor(slice, clippedEnd, slice.yEnd);

    if (segment.midMaterialId == null) {
        var adj = segment.getAdjacentSector();

        if (!adj)
            return;

        var adjSegment = segment.getAdjacentSegment();
        var hiMaterial = adjSegment.getHiMaterial();
        var loMaterial = adjSegment.getLoMaterial();

        var adjProjectedHeightTop = (adj.topZ - (map.player.z + map.player.height)) * this.viewFix[slice.x] / slice.distance;
        var adjProjectedHeightBottom = (adj.bottomZ - (map.player.z + map.player.height)) * this.viewFix[slice.x] / slice.distance;

        var adjSliceTop = fast_floor(this.screenHeight / 2 - adjProjectedHeightTop);
        var adjSliceBottom = fast_floor(this.screenHeight / 2 - adjProjectedHeightBottom);
        var adjClippedTop = fast_floor(Math.max(adjSliceTop, clippedStart));
        var adjClippedBottom = fast_floor(Math.min(adjSliceBottom, clippedEnd));

        for (slice.y = clippedStart; slice.y < adjClippedTop; slice.y++) {
            var screenIndex = slice.x + slice.y * this.screenWidth;
            if (slice.distance < this.zbuffer[screenIndex]) {
                slice.renderTarget[screenIndex] = hiMaterial.sample(slice, slice.textureX, (slice.y - sliceStart) / (adjSliceTop - sliceStart), adjSliceTop - sliceStart);
                this.zbuffer[screenIndex] = slice.distance;
            }
        }

        for (slice.y = adjClippedBottom; slice.y < clippedEnd; slice.y++) {
            var screenIndex = slice.x + slice.y * this.screenWidth;
            if (slice.distance < this.zbuffer[screenIndex]) {
                slice.renderTarget[screenIndex] = loMaterial.sample(slice, slice.textureX, (slice.y - adjClippedBottom) / (sliceEnd - adjSliceBottom), sliceEnd - adjSliceBottom);
                this.zbuffer[screenIndex] = slice.distance;
            }
        }

        var portalSlice = slice.clone();
        portalSlice.sector = adj;
        portalSlice.yStart = adjClippedTop;
        portalSlice.yEnd = adjClippedBottom;
        portalSlice.seenPortals[slice.segment.id] = true;

        this.renderSector(portalSlice);
    }
    else {
        var midMaterial = segment.getMidMaterial();

        for (slice.y = clippedStart; slice.y < clippedEnd; slice.y++) {
            var screenIndex = slice.x + slice.y * this.screenWidth;
            if (slice.distance < this.zbuffer[screenIndex]) {
                var ty = (slice.y - sliceStart) / (sliceEnd - sliceStart);

                slice.renderTarget[screenIndex] = midMaterial.sample(slice, slice.textureX, ty, sliceEnd - sliceStart);
                this.zbuffer[screenIndex] = slice.distance;
            }
        }
    }
}

Renderer.prototype.renderSector = function (slice) {
    for (var j = 0; j < slice.sector.segments.length; j++) {
        slice.segment = slice.sector.segments[j];

        if (slice.seenPortals[slice.segment.id])
            continue;

        slice.intersection = slice.segment.intersect(slice.ray);

        if (slice.intersection == undefined)
            continue;

        var dx = Math.abs(slice.intersection.x - map.player.x);
        var dy = Math.abs(slice.intersection.y - map.player.y);

        if (dy > dx)
            slice.distance = Math.abs(dy / this.trigTable[slice.rayTable].sin);
        else
            slice.distance = Math.abs(dx / this.trigTable[slice.rayTable].cos);

        slice.textureX = Math.sqrt(sqr((slice.intersection.x - slice.segment.ax)) +
            sqr((slice.intersection.y - slice.segment.ay))) / slice.segment.length; // 0.0 - 1.0

        this.renderSlice(slice);
    }
}

Renderer.prototype.render = function (renderTarget) {
    for (var i = 0; i < this.screenWidth * this.screenHeight; i++) {
        renderTarget[i] = 255 << 24;
        this.zbuffer[i] = this.maxViewDist;
    }

    for (var x = 0; x < this.screenWidth; x++) {
        var slice = new RenderSlice();
        slice.renderTarget = renderTarget;
        slice.x = x;
        slice.yStart = 0;
        slice.yEnd = this.screenHeight - 1;
        //slice.rayAngle = normalizeAngle(map.player.angle + (x * this.fov) / (this.screenWidth - 1) - (this.fov / 2.0));
        slice.rayTable = fast_floor(map.player.angle * this.trigCount / 360.0) + x - this.screenWidth / 2 + 1;

        while (slice.rayTable < 0)
            slice.rayTable += this.trigCount;

        while (slice.rayTable >= this.trigCount)
            slice.rayTable -= this.trigCount;

        slice.ray = new Ray(map.player.x, map.player.y,
                map.player.x + this.maxViewDist * this.trigTable[slice.rayTable].cos,
                map.player.y + this.maxViewDist * this.trigTable[slice.rayTable].sin);

        slice.sector = map.player.sector;
        this.renderSector(slice);
    }
    for (var i = 0; i < this.screenWidth * this.screenHeight; i++) {
        renderTarget[i] = colorTint(renderTarget[i], this.frameTint);
    }

    this.frame++;
};