function TextureCache(options) {
    this.cache = {};

    $.extend(true, this, options);
}

TextureCache.prototype.get = function (src, mipmaps) {
    var key = src + "_" + mipmaps;

    if (this.cache[key])
        return this.cache[key];

    this.cache[key] = new Texture({ src: src, generateMipMaps: mipmaps });

    return this.cache[key];
};

var textureCache = new TextureCache();