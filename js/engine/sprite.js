function Sprite(options) {
    this.textureSrc = 'data/bricks.png';
    this.texture = null;
    this.angle = 0;

    $.extend(true, this, options);
}

Sprite.prototype.getTexture = function () {
    if (!this.textureSrc)
        return null;

    if (!this.texture || this.texture.src != this.textureSrc)
        this.texture = textureCache.get(this.textureSrc, true, false);

    return this.texture;
};
