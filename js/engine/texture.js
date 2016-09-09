'use strict';

function Texture(options) {
    this.width = 0;
    this.height = 0;
    this.src = null;
    this.generateMipMaps = false;
    this.filter = false;
    this.data = [];
    this.mipmaps = [];
    this.smallestMipmap = null;
    this.onLoad = null;
    this.img = null;

    $.extend(true, this, options);

    this.reload();
}

Texture.prototype.reload = function () {
    if (globalWorkerId == undefined) {
        this.img = new Image();
        this.img.crossOrigin = '';
        this.img.onload = $.proxy(function (evt) {
            this.loaded(this.img, evt);
        }, this);
        this.img.src = this.src;
        this.img.onerror = $.proxy(function () {
            this.img = new Image();
            this.img.crossOrigin = '';
            this.img.onload = $.proxy(function (evt) {
                this.loaded(this.img, evt);
            }, this);
            this.img.src = 'data/bricks.png';
        }, this);
    }
    else {
        postMessage({ id: globalWorkerId, type: 'getTextureData', texture: this.serialize() });
    }
};

Texture.prototype.loaded = function (img, evt) {
    if (globalWorkerId == undefined) {
        var canvas = document.createElement("canvas");
        this.width = canvas.width = img.width;
        this.height = canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var imgData = ctx.getImageData(0, 0, this.width, this.height);
        this.data = new Uint32Array(this.width * this.height);

        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                this.data[i * this.height + j] = imgData.data[(j * this.width + i) * 4 + 0] |
                    imgData.data[(j * this.width + i) * 4 + 1] << 8 |
                    imgData.data[(j * this.width + i) * 4 + 2] << 16 |
                    imgData.data[(j * this.width + i) * 4 + 3] << 24;
            }
        }
    }

    if (this.generateMipMaps) {
        this.mipmaps = {};

        var prev = this.mipmaps[nearestPow2(this.height)] = { width: this.width, height: this.height, data: this.data };

        var w = fast_floor(this.width / 2.0);
        var h = fast_floor(this.height / 2.0);

        while (w > 1 && h > 1) {
            var mipmap = { width: w, height: h, data: new Uint32Array(w * h) };

            for (var i = 0; i < w; i++) {
                for (var j = 0; j < h; j++) {
                    var pts = [];
                    var x = i * (prev.width - 1) / (w - 1);
                    var y = j * (prev.height - 1) / (h - 1);
                    pts.push({ x: fast_floor(x),
                        y: fast_floor(y) });
                    pts.push({ x: Math.min(fast_floor(x) + 1, prev.width - 1),
                        y: Math.min(fast_floor(y), prev.height - 1) });
                    pts.push({ x: Math.min(fast_floor(x) + 1, prev.width - 1),
                        y: Math.min(fast_floor(y) + 1, prev.height - 1) });
                    pts.push({ x: Math.min(fast_floor(x), prev.width - 1),
                        y: Math.min(fast_floor(y) + 1, prev.height - 1) });
                    //pts.push({ x: Math.min(fast_floor(x) + 1, prev.width - 1),
                    //    y: Math.min(fast_floor(y) + 1, prev.height - 1) });
                    var rsum = 0;
                    var gsum = 0;
                    var bsum = 0;
                    var asum = 0;
                    for (var m = 0; m < pts.length; m++) {
                        rsum += (prev.data[pts[m].x * prev.height + pts[m].y]) & 0xFF;
                        gsum += (prev.data[pts[m].x * prev.height + pts[m].y] >> 8) & 0xFF;
                        bsum += (prev.data[pts[m].x * prev.height + pts[m].y] >> 16) & 0xFF;
                        asum += (prev.data[pts[m].x * prev.height + pts[m].y] >> 24) & 0xFF;
                    }

                    mipmap.data[i * h + j] = (fast_floor(rsum / pts.length) & 0xFF) |
                        ((fast_floor(gsum / pts.length) & 0xFF) << 8) |
                        ((fast_floor(bsum / pts.length) & 0xFF) << 16) |
                        ((fast_floor(asum / pts.length) & 0xFF) << 24);
                }
            }

            prev = this.mipmaps[nearestPow2(mipmap.height)] = mipmap;

            if (w > 1)
                w = Math.max(1, fast_floor(w / 2.0));
            if (h > 1)
                h = Math.max(1, fast_floor(h / 2.0));
        }

        this.smallestMipmap = prev;
    }

    if (this.onLoad)
        this.onLoad(this);
};

Texture.prototype.sample = function (x, y, scaledHeight) {
    var data = this.data;
    var width = this.width;
    var height = this.height;

    //return data[fast_floor(x * width) * height + fast_floor(y * height)];
    if (scaledHeight && this.generateMipMaps && this.smallestMipmap) {
        if (scaledHeight <= this.smallestMipmap.height) {
            data = this.smallestMipmap.data;
            width = this.smallestMipmap.width;
            height = this.smallestMipmap.height;
        }
        else if (scaledHeight < this.height) {
            var mipmap = this.mipmaps[nearestPow2(scaledHeight)];

            data = mipmap.data;
            width = mipmap.width;
            height = mipmap.height;
        }
    }

    if (!data || width <= 0 || height <= 0)
        return 255 << 24;

    x = x < 0.0 ? 0.0 : x;
    y = y < 0.0 ? 0.0 : y;
    x = x >= 1.0 ? 0.999 : x;
    y = y >= 1.0 ? 0.999 : y;

    var fx = (x * width) | 0;
    var fy = (y * height) | 0;

    if (!this.filter)
        return data[fx * height + fy];

    var cx = (fx + 1) % width;
    var cy = (fy + 1) % height;
    var t00 = data[fx * height + fy];
    var t10 = data[cx * height + fy];
    var t11 = data[cx * height + cy];
    var t01 = data[fx * height + cy];
    var wx = x * width - fx;
    var wy = y * height - fy;
    return    (((t00 & 0xFF) * (1.0 - wx) * (1.0 - wy) +
        (t10 & 0xFF) * wx * (1.0 - wy) +
        (t01 & 0xFF) * (1.0 - wx) * wy +
        (t11 & 0xFF) * wx * wy) & 0xFF) |
        (((((t00 >> 8) & 0xFF) * (1.0 - wx) * (1.0 - wy) +
            ((t10 >> 8) & 0xFF) * wx * (1.0 - wy) +
            ((t01 >> 8) & 0xFF) * (1.0 - wx) * wy +
            ((t11 >> 8) & 0xFF) * wx * wy) & 0xFF) << 8) |
        (((((t00 >> 16) & 0xFF) * (1.0 - wx) * (1.0 - wy) +
            ((t10 >> 16) & 0xFF) * wx * (1.0 - wy) +
            ((t01 >> 16) & 0xFF) * (1.0 - wx) * wy +
            ((t11 >> 16) & 0xFF) * wx * wy) & 0xFF) << 16) |
        (((((t00 >> 24) & 0xFF) * (1.0 - wx) * (1.0 - wy) +
            ((t10 >> 24) & 0xFF) * wx * (1.0 - wy) +
            ((t01 >> 24) & 0xFF) * (1.0 - wx) * wy +
            ((t11 >> 24) & 0xFF) * wx * wy) & 0xFF) << 24);
};

Texture.prototype.serialize = function () {
    return {
        src: this.src,
        filter: this.filter,
        generateMipMaps: this.generateMipMaps,
        width: this.width,
        height: this.height
    };
};