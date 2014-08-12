function Material(options) {
    this.id = "Material_" + (new ObjectId().toString());
    this.textureSrc = 'data/bricks.png';
    this.texture = null;
    this.renderAsSky = false;
    this.staticBackground = false;
    this.hurt = 0;
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
        y = slice.y / (renderer.screenHeight - 1);

        if (this.staticBackground) {
            x = slice.x / (renderer.screenWidth - 1);
        }
        else {
            x = slice.rayTable / (renderer.trigCount - 1);
        }

    }

    if (this.isLiquid) {
        x = x + Math.cos(renderer.frame * GAME_CONSTANTS.liquidChurnSpeed * deg2rad) * GAME_CONSTANTS.liquidChurnSize;
        y = y + Math.sin(renderer.frame * GAME_CONSTANTS.liquidChurnSpeed * deg2rad) * GAME_CONSTANTS.liquidChurnSize;
    }

    while (x < 0)
        x += 1.0;

    while (y < 0)
        y += 1.0;

    x -= fast_floor(x);
    y -= fast_floor(y);

    return this.getTexture().sample(x, y, scaledHeight);
}