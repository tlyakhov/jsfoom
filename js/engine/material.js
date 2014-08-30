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

Material.prototype.shadows = function (slice, point) {
    var tempvec = vec3blank(true);

    // Shadows!
    for (var i = 0; i < slice.lights.length; i++) {
        var light = slice.lights[i];

        var rayLength = vec3dist(point, light.pos);

        if (rayLength == 0) {
            continue;
        }

        var sector = slice.sector;
        while (sector) {
            var next = null;
            for (var j = 0; j < sector.segments.length; j++) {
                var segment = sector.segments[j];

                vec3sub(light.pos, point, tempvec);

                if (vec3dot(tempvec, vec3create(segment.normalX, segment.normalY, 0, true)) >= 0)
                    continue;

                var lightIntersection = segment.intersect(point[0], point[1], light.pos[0], light.pos[1]);

                if (lightIntersection && segment.adjacentSectorId) {
                    var adj = segment.getAdjacentSector();

                    if (!adj)
                        continue;

                    // Get the z
                    var r = Math.sqrt(sqr(lightIntersection[0] - point[0]) + sqr(lightIntersection[1] - point[1])) / rayLength;
                    var z = point[2] + r * (light.pos[2] - point[2]);

                    if (z >= adj.bottomZ && z <= adj.topZ) {
                        next = adj;
                    }
                    else {
                        light.marked = false;
                    }
                }
                else if (lightIntersection) { // This light is in shadow
                    light.marked = false;
                }
            }
            if (next)
                sector = next;
            else
                break;
        }
    }
};

Material.prototype.calculateLighting = function (slice, lightmap, mapIndex, point) {
    var tempvec = vec3blank(true);
    this.shadows(slice, vec3add(point, vec3mul(slice.normal, 2, tempvec), tempvec));

    var diffuse = vec3clone(this.ambient, true);
    var specular = this.shininess > 0 ? vec3blank(true) : null;

    var v = vec3blank(true);

    vec3normalize(vec3sub(point, this.map.player.pos, v), v);

    var i = slice.lights.length;

    while (i--) {
        var light = slice.lights[i];

        if (!light.marked) {
            light.marked = true;
            continue;
        }

        var l = vec3sub(light.pos, point, vec3blank(true));

        var distance = vec3length(l);
        vec3mul(l, 1.0 / distance, l);

        var attenuation = light.strength / sqr((distance / light.boundingRadius) + 1.0);

        if (attenuation < GAME_CONSTANTS.lightAttenuationEpsilon)
            continue;

        var diffuseLight = vec3dot(slice.normal, l) * attenuation;

        if (diffuseLight > 0) {
            vec3add(diffuse, vec3mul(light.diffuse, diffuseLight, tempvec), diffuse);

            if (this.shininess > 0) {
                var r = vec3reflect(l, slice.normal, vec3blank(true));
                var specularLight = vec3dot(v, r);

                if (specularLight > 0) {
                    vec3mul3(this.specular, light.specular, tempvec);
                    vec3mul(tempvec, Math.pow(specularLight, this.shininess) * attenuation, tempvec);
                    vec3add(specular, tempvec, specular);
                }
            }
        }
    }

    lightmap[mapIndex + 0] = diffuse[0];
    lightmap[mapIndex + 1] = diffuse[1];
    lightmap[mapIndex + 2] = diffuse[2];
    if (specular) {
        lightmap[mapIndex + 3] = specular[0];
        lightmap[mapIndex + 4] = specular[1];
        lightmap[mapIndex + 5] = specular[2];
    }
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

    // Lightmap access
    var lightmap = null;
    var mapIndex00 = 0;
    var mapIndex10 = 0;
    var mapIndex11 = 0;
    var mapIndex01 = 0;
    var q00 = null;
    var q10 = null;
    var q11 = null;
    var q01 = null;
    var wu = 0.0;
    var wv = 0.0;

    // Optimize for our simple world geometry
    if (slice.normal[2] != 0) {
        lightmap = slice.normal[2] < 0 ? slice.sector.ceilLightmap : slice.sector.floorLightmap;
        var v00 = slice.world;
        var v10 = vec3clone(v00, true);
        var v01 = vec3clone(v00, true);
        var v11 = vec3clone(v00, true);
        v10[0] += GAME_CONSTANTS.lightGrid;
        v11[0] += GAME_CONSTANTS.lightGrid;
        v11[1] += GAME_CONSTANTS.lightGrid;
        v01[1] += GAME_CONSTANTS.lightGrid;
        mapIndex00 = slice.sector.lightmapAddress(v00);
        mapIndex10 = slice.sector.lightmapAddress(v10);
        mapIndex11 = slice.sector.lightmapAddress(v11);
        mapIndex01 = slice.sector.lightmapAddress(v01);
        q00 = slice.sector.lightmapWorld(v00, true);
        q10 = slice.sector.lightmapWorld(v10, true);
        q11 = slice.sector.lightmapWorld(v11, true);
        q01 = slice.sector.lightmapWorld(v01, true);
        wu = 1.0 - (slice.world[0] - q00[0]) / GAME_CONSTANTS.lightGrid;
        wv = 1.0 - (slice.world[1] - q00[1]) / GAME_CONSTANTS.lightGrid;
    }
    else {
        lightmap = slice.segment.lightmap;
        wu = fast_floor(x * (slice.segment.lightmapWidth - 2)) + 1;
        wv = fast_floor(y * (slice.segment.lightmapHeight - 2)) + 1;
        mapIndex00 = (wu + wv * slice.segment.lightmapWidth) * 6;
        mapIndex10 = (Math.min(wu + 1, slice.segment.lightmapWidth) + wv * slice.segment.lightmapWidth) * 6;
        mapIndex11 = (Math.min(wu + 1, slice.segment.lightmapWidth) + Math.min(wv + 1, slice.segment.lightmapHeight) * slice.segment.lightmapWidth) * 6;
        mapIndex01 = (wu + Math.min(wv + 1, slice.segment.lightmapHeight) * slice.segment.lightmapWidth) * 6;
        q00 = slice.segment.lightmapAddressToWorld(mapIndex00, true);
        q10 = slice.segment.lightmapAddressToWorld(mapIndex10, true);
        q11 = slice.segment.lightmapAddressToWorld(mapIndex11, true);
        q01 = slice.segment.lightmapAddressToWorld(mapIndex01, true);
        wu = x * (slice.segment.lightmapWidth - 2);
        wv = y * (slice.segment.lightmapHeight - 2);
        wu = 1.0 - (wu - fast_floor(wu));
        wv = 1.0 - (wv - fast_floor(wv));
    }

    if (lightmap[mapIndex00] < 0)
        this.calculateLighting(slice, lightmap, mapIndex00, q00);
    if (lightmap[mapIndex10] < 0)
        this.calculateLighting(slice, lightmap, mapIndex10, q10);
    if (lightmap[mapIndex11] < 0)
        this.calculateLighting(slice, lightmap, mapIndex11, q11);
    if (lightmap[mapIndex01] < 0)
        this.calculateLighting(slice, lightmap, mapIndex01, q01);

    var mapDiffuse = vec3create(lightmap[mapIndex00 + 0] * wu * wv +
            lightmap[mapIndex10 + 0] * (1.0 - wu) * wv +
            lightmap[mapIndex11 + 0] * (1.0 - wu) * (1.0 - wv) +
            lightmap[mapIndex01 + 0] * wu * (1.0 - wv),
            lightmap[mapIndex00 + 1] * wu * wv +
            lightmap[mapIndex10 + 1] * (1.0 - wu) * wv +
            lightmap[mapIndex11 + 1] * (1.0 - wu) * (1.0 - wv) +
            lightmap[mapIndex01 + 1] * wu * (1.0 - wv), lightmap[mapIndex00 + 2] * wu * wv +
            lightmap[mapIndex10 + 2] * (1.0 - wu) * wv +
            lightmap[mapIndex11 + 2] * (1.0 - wu) * (1.0 - wv) +
            lightmap[mapIndex01 + 2] * wu * (1.0 - wv), true);

    var sum = vec3create(int2r(surface) * this.diffuse[0] / 255.0,
            int2g(surface) * this.diffuse[1] / 255.0,
            int2b(surface) * this.diffuse[2] / 255.0, true);

    vec3mul3(sum, mapDiffuse, sum);
    if (this.shininess > 0) {
        var mapSpecular = vec3create(lightmap[mapIndex00 + 3], lightmap[mapIndex00 + 4], lightmap[mapIndex00 + 5], true);
        vec3add(sum, mapSpecular, sum);
    }
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