function Renderer(options) {
    this.screenWidth = 640;
    this.screenHeight = 360;
    this.fov = 75.0;
    this.maxViewDist = 100000.0;

    $.extend(true, this, options);

    this.cameraToProjectionPlane = (this.screenWidth / 2.0) / Math.tan(this.fov * deg2rad / 2.0);

    this.initTables();
}

Renderer.prototype.initTables = function () {
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

    for (var sliceY = start; sliceY < end; sliceY++) {
        var distToFloor = (-sector.bottomZ + (player.z + player.height)) * this.viewFix[slice.x] / (sliceY - this.screenHeight / 2);
        var scaler = sector.floorTex.height * sector.floorScale * 0.25 / distToFloor;
        var screenIndex = slice.x + sliceY * this.screenWidth;

        if (distToFloor < this.zbuffer[screenIndex]) {
            var floorX = player.x + this.trigTable[slice.rayTable].cos * distToFloor;
            var floorY = player.y + this.trigTable[slice.rayTable].sin * distToFloor;

            var tx = floorX / sector.floorScale - fast_floor(floorX / sector.floorScale);
            var ty = floorY / sector.floorScale - fast_floor(floorY / sector.floorScale);
            if (tx < 0)
                tx = tx + 1.0;
            if (ty < 0)
                ty = ty + 1.0;
            slice.renderTarget[screenIndex] = sector.floorTex.sample(tx, ty, scaler);
            this.zbuffer[screenIndex] = distToFloor;
        }
    }
};

Renderer.prototype.renderCeiling = function (slice, start, end) {
    var sector = slice.segment.sector;

    for (var sliceY = start; sliceY < end; sliceY++) {
        var distToCeiling = (sector.topZ - (player.z + player.height)) * this.viewFix[slice.x] / (this.screenHeight / 2 - 1 - sliceY);
        var scaler = sector.ceilTex.height * sector.ceilScale * 0.25 / distToCeiling;
        var screenIndex = slice.x + sliceY * this.screenWidth;

        if (distToCeiling < this.zbuffer[screenIndex]) {
            var ceilingX = player.x + this.trigTable[slice.rayTable].cos * distToCeiling;
            var ceilingY = player.y + this.trigTable[slice.rayTable].sin * distToCeiling;

            var tx = Math.abs(ceilingX / sector.ceilScale - fast_floor(ceilingX / sector.ceilScale));
            var ty = Math.abs(ceilingY / sector.ceilScale - fast_floor(ceilingY / sector.ceilScale));
            slice.renderTarget[screenIndex] = sector.ceilTex.sample(tx, ty, scaler);
            this.zbuffer[screenIndex] = distToCeiling;
        }
    }
};

Renderer.prototype.renderSlice = function (slice) {
    var segment = slice.segment;
    var sector = slice.segment.sector;
    var projectedHeightTop = (sector.topZ - (player.z + player.height)) * this.viewFix[slice.x] / slice.distance;
    var projectedHeightBottom = (sector.bottomZ - (player.z + player.height)) * this.viewFix[slice.x] / slice.distance;

    var sliceStart = fast_floor(this.screenHeight / 2 - projectedHeightTop);
    var sliceEnd = fast_floor(this.screenHeight / 2 - projectedHeightBottom);
    var clippedStart = fast_floor(Math.max(sliceStart, slice.yStart));
    var clippedEnd = fast_floor(Math.min(sliceEnd, slice.yEnd));

    this.renderCeiling(slice, slice.yStart, clippedStart);
    this.renderFloor(slice, clippedEnd, slice.yEnd);

    var tx = (slice.textureX * segment.length / (sector.topZ - sector.bottomZ));
    tx = tx - fast_floor(tx);

    if (segment.midTexSrc == null) {
        var hiTex = segment.getHiTex();
        var loTex = segment.getLoTex();

        var adj = segment.getAdjacentSector();

        if (!adj)
            return;

        var adjProjectedHeightTop = (adj.topZ - (player.z + player.height)) * this.viewFix[slice.x] / slice.distance;
        var adjProjectedHeightBottom = (adj.bottomZ - (player.z + player.height)) * this.viewFix[slice.x] / slice.distance;

        var adjSliceTop = fast_floor(this.screenHeight / 2 - adjProjectedHeightTop);
        var adjSliceBottom = fast_floor(this.screenHeight / 2 - adjProjectedHeightBottom);
        var adjClippedTop = fast_floor(Math.max(adjSliceTop, clippedStart));
        var adjClippedBottom = fast_floor(Math.min(adjSliceBottom, clippedEnd));

        for (var sliceY = clippedStart; sliceY < adjClippedTop; sliceY++) {
            var screenIndex = slice.x + sliceY * this.screenWidth;
            if (slice.distance < this.zbuffer[screenIndex]) {
                var ty = (sliceY - sliceStart) / (sliceEnd - sliceStart);

                slice.renderTarget[screenIndex] = hiTex.sample(tx, ty, sliceEnd - sliceStart);
                this.zbuffer[screenIndex] = slice.distance;
            }
        }

        for (var sliceY = adjClippedBottom; sliceY < clippedEnd; sliceY++) {
            var screenIndex = slice.x + sliceY * this.screenWidth;
            if (slice.distance < this.zbuffer[screenIndex]) {
                var ty = (sliceY - sliceStart) / (sliceEnd - sliceStart);

                slice.renderTarget[screenIndex] = loTex.sample(tx, ty, sliceEnd - sliceStart);
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
        var midTex = segment.getMidTex();

        for (var sliceY = clippedStart; sliceY < clippedEnd; sliceY++) {
            var screenIndex = slice.x + sliceY * this.screenWidth;
            if (slice.distance < this.zbuffer[screenIndex]) {
                var ty = (sliceY - sliceStart) / (sliceEnd - sliceStart);

                slice.renderTarget[screenIndex] = midTex.sample(tx, ty, sliceEnd - sliceStart);
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

        var dx = Math.abs(slice.intersection.x - player.x);
        var dy = Math.abs(slice.intersection.y - player.y);

        if (dy > dx)
            slice.distance = Math.abs(dy / this.trigTable[slice.rayTable].sin);
        else
            slice.distance = Math.abs(dx / this.trigTable[slice.rayTable].cos);

        slice.textureX = Math.sqrt((slice.intersection.x - slice.segment.ax) * (slice.intersection.x - slice.segment.ax) +
            (slice.intersection.y - slice.segment.ay) * (slice.intersection.y - slice.segment.ay)) / slice.segment.length; // 0.0 - 1.0

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
        //slice.rayAngle = normalizeAngle(player.angle + (x * this.fov) / (this.screenWidth - 1) - (this.fov / 2.0));
        slice.rayTable = fast_floor(player.angle * this.trigCount / 360.0) + x - this.screenWidth / 2 + 1;

        while (slice.rayTable < 0)
            slice.rayTable += this.trigCount;

        while (slice.rayTable >= this.trigCount)
            slice.rayTable -= this.trigCount;

        slice.ray = new Ray(player.x, player.y,
                player.x + this.maxViewDist * this.trigTable[slice.rayTable].cos,
                player.y + this.maxViewDist * this.trigTable[slice.rayTable].sin);

        slice.sector = player.sector;
        this.renderSector(slice);
    }
}