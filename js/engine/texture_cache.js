function TextureCache(options) {
    this.cache = {};

    $.extend(true, this, options);
}

TextureCache.prototype.get = function (src, mipmaps, filter, onLoad) {
    var key = src + "_" + mipmaps + "_" + filter;

    if (this.cache[key])
        return this.cache[key];

    this.cache[key] = new Texture({ src: src, generateMipMaps: mipmaps, filter: filter, onLoad: onLoad });

    return this.cache[key];
};

var textureCache = new TextureCache();