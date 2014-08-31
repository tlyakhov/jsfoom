var VEC3_TYPE = Float64Array;

// Not very OOP, but EXTREMELY fast for JS
var _vec3pool = new ObjectCache(1 << 16, function () {
    return new VEC3_TYPE(3);
});

function vec3create(x, y, z, pool) {
    var v = null;

    if (pool)
        v = _vec3pool.get();
    else
        v = new VEC3_TYPE(3);

    v[0] = x;
    v[1] = y;
    v[2] = z;

    return v;
}

function vec3blank(pool) {
    if (pool)
        return _vec3pool.get();
    else
        return new VEC3_TYPE(3);
}

function vec3clone(v, pool) {
    return vec3create(v[0], v[1], v[2], pool);
}

function vec3add(v, v2, vout) {
    vout[0] = v[0] + v2[0];
    vout[1] = v[1] + v2[1];
    vout[2] = v[2] + v2[2];

    return vout;
}

function vec3sub(v, v2, vout) {
    vout[0] = v[0] - v2[0];
    vout[1] = v[1] - v2[1];
    vout[2] = v[2] - v2[2];

    return vout;
}

function vec3mul3(v, v2, vout) {
    vout[0] = v[0] * v2[0];
    vout[1] = v[1] * v2[1];
    vout[2] = v[2] * v2[2];

    return vout;
}

function vec3mul(v, x, vout) {
    vout[0] = v[0] * x;
    vout[1] = v[1] * x;
    vout[2] = v[2] * x;

    return vout;
}

function vec3length(v) {
    return Math.sqrt(sqr(v[0]) + sqr(v[1]) + sqr(v[2]));
}

function vec3dist2(v, v2) {
    return sqr(v[0] - v2[0]) + sqr(v[1] - v2[1]) + sqr(v[2] - v2[2]);
}

function vec3dist(v, v2) {
    return Math.sqrt(sqr(v[0] - v2[0]) + sqr(v[1] - v2[1]) + sqr(v[2] - v2[2]));
}

function vec3normalize(v, vout) {
    var l = Math.sqrt(sqr(v[0]) + sqr(v[1]) + sqr(v[2]));

    if (l == 0.0) {
        vout[0] = 0.0;
        vout[1] = 0.0;
        vout[2] = 0.0;

        return vout;
    }

    vout[0] = v[0] / l;
    vout[1] = v[1] / l;
    vout[2] = v[2] / l;

    return vout;
}

function vec3dot(v, v2) {
    return v[0] * v2[0] + v[1] * v2[1] + v[2] * v2[2];
}

function vec3reflect(v, normal, vout) {
    return vec3sub(vec3mul(normal, 2 * vec3dot(v, normal), vout), v, vout);
}

function vec3clamp(v, min, max, vout) {
    vout[0] = Math.max(min, Math.min(max, v[0]));
    vout[1] = Math.max(min, Math.min(max, v[1]));
    vout[2] = Math.max(min, Math.min(max, v[2]));

    return vout;
}