inherit(EngineObject, Material);

function Material(options) {
    EngineObject.call(this, options);

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

Material.editableProperties = EngineObject.editableProperties.concat([
    { name: 'textureSrc', friendly: 'Texture Source', type: 'string' },
    { name: 'ambient', friendly: 'Ambient Color', type: 'vector' },
    { name: 'diffuse', friendly: 'Diffuse Color', type: 'vector' },
    { name: 'renderAsSky', friendly: 'Render as sky?', type: 'bool' },
    { name: 'staticBackground', friendly: 'Static Background?', type: 'bool' },
    { name: 'hurt', friendly: 'Hurt', type: 'float' },
    { name: 'isLiquid', friendly: 'Is Liquid?', type: 'bool' }
]);

Material.prototype.getTexture = function () {
    if (!this.textureSrc)
        return null;

    if (!this.texture || this.texture.src != this.textureSrc)
        this.texture = textureCache.get(this.textureSrc, true, true);

    return this.texture;
};

Material.prototype.sample = function (slice, u, v, light, scaledHeight) {
    if (this.renderAsSky) {
        v = slice.y / (slice.renderer.screenHeight - 1);

        if (this.staticBackground) {
            u = slice.x / (slice.renderer.screenWidth - 1);
        }
        else {
            u = slice.rayTable / (slice.renderer.trigCount - 1);
        }

    }

    if (this.isLiquid) {
        u = u + Math.cos(slice.renderer.frame * GAME_CONSTANTS.liquidChurnSpeed * deg2rad) * GAME_CONSTANTS.liquidChurnSize;
        v = v + Math.sin(slice.renderer.frame * GAME_CONSTANTS.liquidChurnSpeed * deg2rad) * GAME_CONSTANTS.liquidChurnSize;
    }

    if (u < 0)
        u = fast_floor(u) - u;
    else if (u >= 1.0)
        u -= fast_floor(u);

    if (v < 0)
        v = fast_floor(v) - v;
    else if (v >= 1.0)
        v -= fast_floor(v);

    var surface = this.getTexture().sample(u, v, this.renderAsSky ? null : scaledHeight);

    if (this.renderAsSky)
        return surface;

    var sum = vec3create(int2r(surface) * this.diffuse[0],
            int2g(surface) * this.diffuse[1],
            int2b(surface) * this.diffuse[2], true);

    if (light)
        vec3mul3(sum, light, sum);
    vec3add(this.ambient, sum, sum);
    vec3clamp(sum, 0.0, 255.0, sum);

    return (sum[0] & 0xFF) |
        ((sum[1] & 0xFF) << 8) |
        ((sum[2] & 0xFF) << 16) |
        (surface & (0xFF << 24));
    //return rgba2int(sum[0], sum[1], sum[2], surface >> 24);
};

Material.prototype.serialize = function () {
    var r = EngineObject.prototype.serialize.call(this);

    r.textureSrc = this.textureSrc;
    r.ambient = this.ambient;
    r.diffuse = this.diffuse;
    r.renderAsSky = this.renderAsSky;
    r.staticBackground = this.staticBackground;
    r.hurt = this.hurt;
    r.isLiquid = this.isLiquid;

    return r;
};

Material.deserialize = function (data, material) {
    material = EngineObject.deserialize(data, material);

    material.textureSrc = data.textureSrc;
    material.ambient = data.ambient;
    material.diffuse = data.diffuse;
    material.renderAsSky = data.renderAsSky;
    material.staticBackground = data.staticBackground;
    material.hurt = data.hurt;
    material.isLiquid = data.isLiquid;

    return material;
};