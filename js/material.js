function Material(options) {
    this.id = "Material_" + (new ObjectId().toString());
    this.textureSrc = 'data/bricks.png';
    this.texture = null;
    this.renderAsSky = false;
    this.isLiquid = false;
    this.map = null;

    $.extend(true, this, options);
}

Material.prototype.getTexture = function () {
    if (!this.textureSrc)
        return null;

    if (!this.texture || this.texture.src != this.textureSrc)
        this.texture = textureCache.get(this.textureSrc, true);

    return this.texture;
};

Material.prototype.sample = function (slice, x, y, scaledHeight) {
    if (this.renderAsSky) {
        x = slice.x / (renderer.screenWidth - 1);
        y = slice.y / (renderer.screenHeight - 1);
    }

    if (this.isLiquid) {
        x = x + Math.cos(renderer.frame * deg2rad) * 0.03;
        y = y + Math.sin(renderer.frame * deg2rad) * 0.03;
    }

    while (x < 0)
        x += 1.0;

    while (y < 0)
        y += 1.0;

    x -= fast_floor(x);
    y -= fast_floor(y);

    return this.getTexture().sample(x, y, scaledHeight);
}