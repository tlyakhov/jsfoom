function Material(options) {
    this.id = "Material_" + (new ObjectId().toString());
    this.textureSrc = 'data/bricks.png';
    this.texture = null;
    this.ambient = vec3create(10, 10, 10);
    this.diffuse = vec3create(1.0, 1.0, 1.0);

    this.renderAsSky = false;
    this.staticBackground = false;
    this.hurt = 0;
    this.isLiquid = false;
    this.map = null;

    $.extend(true, this, options);
}

classes['Material'] = Material;

Material.prototype.getTexture = function () {
    if (!this.textureSrc)
        return null;

    if (!this.texture || this.texture.src != this.textureSrc)
        this.texture = textureCache.get(this.textureSrc, true, true);

    return this.texture;
};

Material.prototype.sample = function (slice, x, y, scaledHeight) {
    if (this.renderAsSky) {
        y = slice.y / (slice.renderer.screenHeight - 1);

        if (this.staticBackground) {
            x = slice.x / (slice.renderer.screenWidth - 1);
        }
        else {
            x = slice.rayTable / (slice.renderer.trigCount - 1);
        }

    }

    if (this.isLiquid) {
        x = x + Math.cos(slice.renderer.frame * GAME_CONSTANTS.liquidChurnSpeed * deg2rad) * GAME_CONSTANTS.liquidChurnSize;
        y = y + Math.sin(slice.renderer.frame * GAME_CONSTANTS.liquidChurnSpeed * deg2rad) * GAME_CONSTANTS.liquidChurnSize;
    }

    if (x < 0)
        x = fast_floor(x) - x;
    else if (x >= 1.0)
        x -= fast_floor(x);

    if (y < 0)
        y = fast_floor(y) - y;
    else if (y >= 1.0)
        y -= fast_floor(y);

    var surface = this.getTexture().sample(x, y, scaledHeight);

    if (this.renderAsSky)
        return surface;

    var v = this.map.light(slice.world, slice.normal, slice.sector, slice.segment, x, y, true);
    var sum = vec3create(int2r(surface) * this.diffuse[0],
            int2g(surface) * this.diffuse[1],
            int2b(surface) * this.diffuse[2], true);

    vec3mul3(sum, v, sum);
    vec3add(this.ambient, sum, sum);
    vec3clamp(sum, 0.0, 255.0, sum);

    return (sum[0] & 0xFF) |
        ((sum[1] & 0xFF) << 8) |
        ((sum[2] & 0xFF) << 16) |
        (surface & (0xFF << 24));
    //return rgba2int(sum[0], sum[1], sum[2], surface >> 24);
};

Material.prototype.serialize = function () {
    var r = {
        id: this.id,
        textureSrc: this.textureSrc,
        ambient: this.ambient,
        diffuse: this.diffuse,
        renderAsSky: this.renderAsSky,
        staticBackground: this.staticBackground,
        hurt: this.hurt,
        isLiquid: this.isLiquid
    };

    return r;
};

Material.deserialize = function (data, material) {
    if (!material)
        material = new Material();

    material.id = data.id;
    material.textureSrc = data.textureSrc;
    material.ambient = data.ambient;
    material.diffuse = data.diffuse;
    material.renderAsSky = data.renderAsSky;
    material.staticBackground = data.staticBackground;
    material.hurt = data.hurt;
    material.isLiquid = data.isLiquid;

    return material;
};