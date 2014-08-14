function Material(options) {
    this.id = "Material_" + (new ObjectId().toString());
    this.textureSrc = 'data/bricks.png';
    this.texture = null;
    this.ambient = new Vector3(0.05, 0.05, 0.05);
    this.diffuse = new Vector3(1.0, 1.0, 1.0);
    this.specular = new Vector3(1.0, 1.0, 1.0);
    this.shininess = 0.0;

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
        this.texture = textureCache.get(this.textureSrc, true, true);

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

    var surface = this.getTexture().sample(x, y, scaledHeight);

    if (this.renderAsSky)
        return surface;

    // Lighting!
    var surfaceDiffuse = new Vector3(int2r(surface) * this.diffuse.x / 255.0,
            int2g(surface) * this.diffuse.y / 255.0,
            int2b(surface) * this.diffuse.z / 255.0);

    var sum = this.ambient.clone();

    var v = slice.world.sub(new Vector3(map.player.x, map.player.y, map.player.z + map.player.height)).normalize();

    for (var i = 0; i < slice.lights.length; i++) {
        var light = slice.lights[i];

        var l = slice.world.sub(new Vector3(light.x, light.y, light.z));
        l = l.normalize();

        var diffuseLight = Math.abs(slice.normal.dot(l));

        if (diffuseLight > 0) {
            sum = sum.add(light.diffuse.mul3(surfaceDiffuse).mul(diffuseLight));

            if (this.shininess > 0) {
                var r = l.reflect(slice.normal);
                var specularLight = v.dot(r);

                if (specularLight > 0) {
                    sum = sum.add(this.specular.mul3(light.specular).mul(Math.pow(specularLight, this.shininess)));
                }
            }
        }
    }

    sum = sum.clamp(0.0, 1.0);
    return rgba2int((sum.x * 255) & 0xFF, (sum.y * 255) & 0xFF, (sum.z * 255) & 0xFF, surface >> 24);
};