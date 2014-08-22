function Material(options) {
    this.id = "Material_" + (new ObjectId().toString());
    this.textureSrc = 'data/bricks.png';
    this.texture = null;
    this.ambient = vec3create(0.05, 0.05, 0.05);
    this.diffuse = vec3create(1.0, 1.0, 1.0);
    this.specular = vec3create(1.0, 1.0, 1.0);
    this.shininess = 0.0;

    this.renderAsSky = false;
    this.staticBackground = false;
    this.hurt = 0;
    this.isLiquid = false;
    this.map = null;

    this.lastDiffuse = null;
    this.lastSpecular = null;
    this.lastSampleWorld = null;

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

Material.prototype.shadows = function (slice, sector, seenPortals) {
    // Shadows!
    for (var i = 0; i < slice.lights.length; i++) {
        var light = slice.lights[i];

        var rayLength = Math.sqrt(sqr(slice.world[0] - light.pos[0]) + sqr(slice.world[1] - light.pos[1]));

        if (rayLength == 0) {
            light.marked = true;
            continue;
        }

        for (var j = 0; j < sector.segments.length; j++) {
            var segment = sector.segments[j];

            if (seenPortals[segment.id])
                continue;

            var lightIntersection = segment.intersect(slice.world[0], slice.world[1], light.pos[0], light.pos[1]);

            if (lightIntersection && segment.midMaterialId == null) {
                var adj = segment.getAdjacentSector();

                if (!adj)
                    continue;

                if (seenPortals[adj.id])
                    continue;

                seenPortals[segment.id] = segment;

                // Get the z
                var r = Math.sqrt(sqr(lightIntersection[0] - slice.world[0]) + sqr(lightIntersection[1] - slice.world[1])) / rayLength;
                var z = slice.world[2] + r * (light.pos[2] - slice.world[2]);

                if (z >= adj.bottomZ && z <= adj.topZ)
                    this.shadows(slice, adj, seenPortals);

                continue;
            }
            else if (lightIntersection) // This light is in shadow
                continue;

            light.marked = true;
        }
    }
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

    if (x < 0)
        x = fast_floor(x) - x;
    else if (x >= 1.0)
        x -= fast_floor(x);

    if (y < 0)
        y = fast_floor(y) - y;
    else if (y >= 1.0)
        y -= fast_floor(y);

    // Lighting!

    // Cheat a little
    if (!this.renderAsSky && (!this.lastSampleWorld || vec3dist2(this.lastSampleWorld, slice.world) > 0.5)) {
        //if (!this.renderAsSky)
        //this.shadows(slice, slice.sector, {}); // Shadows are SLOW

        this.lastDiffuse = vec3clone(this.ambient, true);
        this.lastSpecular = this.shininess > 0 ? vec3blank(true) : null;

        var v = vec3blank(true);

        vec3normalize(vec3sub(slice.world, map.player.pos, v), v);

        var i = slice.lights.length;

        while (i--) {
            var light = slice.lights[i];

            var l = vec3sub(slice.world, light.pos, vec3blank(true));

            var distance = vec3length(l);
            vec3mul(l, 1.0 / distance, l);

            var attenuation = light.strength / sqr((distance / light.boundingRadius) + 1.0);

            if (attenuation < GAME_CONSTANTS.lightAttenuationEpsilon)
                continue;

            var diffuseLight = Math.abs(vec3dot(slice.normal, l)) * attenuation;

            if (diffuseLight > 0) {
                var tempvec = vec3blank(true);
                vec3add(this.lastDiffuse, vec3mul(light.diffuse, diffuseLight, tempvec), this.lastDiffuse);

                if (this.shininess > 0) {
                    var r = vec3reflect(l, slice.normal, vec3blank(true));
                    var specularLight = vec3dot(v, r);

                    if (specularLight > 0) {
                        vec3mul3(this.specular, light.specular, tempvec);
                        vec3mul(tempvec, Math.pow(specularLight, this.shininess) * attenuation, tempvec);
                        vec3add(this.lastSpecular, tempvec, this.lastSpecular);
                    }
                }
            }
        }
        this.lastSampleWorld = vec3clone(slice.world, true);
    }

    var surface = this.getTexture().sample(x, y, scaledHeight);

    if (this.renderAsSky)
        return surface;

    var sum = vec3create(int2r(surface) * this.diffuse[0] / 255.0,
            int2g(surface) * this.diffuse[1] / 255.0,
            int2b(surface) * this.diffuse[2] / 255.0, true);

    vec3mul3(sum, this.lastDiffuse, sum);
    if (this.lastSpecular)
        vec3add(sum, this.lastSpecular, sum);
    vec3clamp(sum, 0.0, 1.0, sum);

    return rgba2int((sum[0] * 255) & 0xFF, (sum[1] * 255) & 0xFF, (sum[2] * 255) & 0xFF, surface >> 24);
};

Material.prototype.serialize = function () {
    var r = {
        id: this.id,
        textureSrc: this.textureSrc,
        ambient: this.ambient,
        diffuse: this.diffuse,
        specular: this.specular,
        shininess: this.shininess,
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
    material.specular = data.specular;
    material.shininess = data.shininess;
    material.renderAsSky = data.renderAsSky;
    material.staticBackground = data.staticBackground;
    material.hurt = data.hurt;
    material.isLiquid = data.isLiquid;

    return material;
};