'use strict';

function TextureCache(options) {
    this.cache = {};

    $.extend(true, this, options);
}

TextureCache.prototype.get = function (options) {
    var key = options.src + "_" + options.generateMipMaps + "_" + options.filter;

    if (this.cache[key])
        return this.cache[key];

    this.cache[key] = new Texture(options);

    return this.cache[key];
};

var textureCache = new TextureCache();