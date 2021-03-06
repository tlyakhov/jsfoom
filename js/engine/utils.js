'use strict';

var classes = {};

function createFromName(name, opts) {
    var o = Object.create(classes[name].prototype);

    classes[name].apply(o, [ opts ]);

    return o;
}

function inherit(clazz, subclass) {
    subclass.prototype = new clazz();
    subclass.prototype.constructor = subclass;
    subclass.prototype.parent = clazz.prototype;
    subclass.superclasses = [ clazz ];

    if (clazz.superclasses) {
        for (var i = 0; i < clazz.superclasses.length; i++) {
            subclass.superclasses.push(clazz.superclasses[i]);
        }
    }
}

function isA(object, clazz) {
    if (!object)
        return false;

    if (object.constructor == clazz)
        return true;

    if (!object.constructor.superclasses)
        return false;

    for (var i = 0; i < object.constructor.superclasses.length; i++) {
        if (object.constructor.superclasses[i] == clazz)
            return true;
    }

    return false;
}


function typeIsA(type, clazz) {
    if (!type)
        return false;

    if (type == clazz)
        return true;

    if (!type.superclasses)
        return false;

    for (var i = 0; i < type.superclasses.length; i++) {
        if (type.superclasses[i] == clazz)
            return true;
    }

    return false;
}

function subclassesOf(clazz) {
    if(typeof clazz == 'string')
        clazz = classes[clazz];

    var subclasses = [];
    for(var clazz2 in classes) {
        if(typeIsA(classes[clazz2], clazz))
            subclasses.push(classes[clazz2]);
    }

    subclasses.sort(function(a, b) {
        if (a.name < b.name)
            return -1;
        else if(a.name > b.name)
            return 1;
        else
            return 0;
    });

    return subclasses;
}

function camelCase(capitalized) {
    return capitalized[0].toLowerCase() + capitalized.substring(1);
}

function fast_floor(v) {
    return v | 0;
}

function normalizeAngle(a) {
    var result = a;

    while (result < 0) {
        result += 360.0;
    }
    while (result >= 360.0) {
        result -= 360.0;
    }
    return result;
}

var deg2rad = Math.PI / 180.0;
var rad2deg = 180.0 / Math.PI;

function distance2D(x1, y1, x2, y2) {
    return Math.sqrt(sqr((x2 - x1)) + sqr((y2 - y1)));
}

function colorTint(target, tint) {
    if (tint == 0)
        return target;
    if (((tint >> 24) & 0xFF) == 0xFF)
        return tint;

    var ta = ((target >> 24) & 0xFF);
    var tb = ((target >> 16) & 0xFF);
    var tg = ((target >> 8) & 0xFF);
    var tr = ((target) & 0xFF);
    var w = ((tint >> 24) & 0xFF) / 255.0;
    var rb = fast_floor(tb * (1.0 - w) + ((tint >> 16) & 0xFF) * w);
    var rg = fast_floor(tg * (1.0 - w) + ((tint >> 8) & 0xFF) * w);
    var rr = fast_floor(tr * (1.0 - w) + ((tint) & 0xFF) * w);

    return (ta << 24) | ((rb & 0xFF) << 16) | ((rg & 0xFF) << 8) | (rr & 0xFF);
}

function color2bw(target) {
    var ta = ((target >> 24) & 0xFF);
    var tb = ((target >> 16) & 0xFF);
    var tg = ((target >> 8) & 0xFF);
    var tr = ((target) & 0xFF);

    var bw = Math.max(0, Math.min(0xFF, tr * 0.21 + tg * 0.72 + tb * 0.07));

    return (ta << 24) | ((bw & 0xFF) << 16) | ((bw & 0xFF) << 8) | (bw & 0xFF);
}

function rgba2int(r, g, b, a) {
    return (r & 0xFF) | ((g & 0xFF) << 8) | ((b & 0xFF) << 16) | ((a & 0xFF) << 24);
}

function rgb2int(r, g, b) {
    return rgba2int(r, g, b, 255);
}

function int2r(i) {
    return i & 0xFF;
}

function int2g(i) {
    return (i >> 8) & 0xFF;
}

function int2b(i) {
    return (i >> 16) & 0xFF;
}

function int2hex(i) {
    return (0x1000000 | (i & 0xFFFFFF)).toString(16).substring(1);
}

function rgb2hex(rgb) {
    return int2hex((rgb[2] * 255) | ((rgb[1] * 255) << 8) | ((rgb[0] * 255) << 16));
}

function nearestPow2(n) {
    n--;

    n |= n >> 1;
    n |= n >> 2;
    n |= n >> 4;
    n |= n >> 8;
    n |= n >> 16;

    return ++n;
}

function sign(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

function sqr(x) {
    return x * x;
}

function dist2(ax, ay, bx, by) {
    return sqr(bx - ax) + sqr(by - ay);
}

function typeof2(object) {
    return Object.prototype.toString.call(object);
}

function preciseTime() {
    if (performance.now)
        return performance.now();

    return new Date().valueOf();
}

function padNumber(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function stringSerialize(obj) {
    var replacer = function (key, value) {
        var type = typeof2(value);

        if (type == '[object Float64Array]')
            return Array.apply([], value);
        else
            return value;
    };

    var isArray = typeof2(obj) === '[object Array]';

    if(isArray) {
        var a = [];
        for(var i = 0; i < obj.length; i++) {
            a.push(obj[i].serialize());
        }

        return JSON.stringify(a, replacer);
    }
    else
        return JSON.stringify(obj.serialize(), replacer);
}

function strictGetScript(source, done) {
    var script = document.createElement('script');
    var prior = document.getElementsByTagName('script')[0];
    script.async = 1;
    prior.parentNode.insertBefore(script, prior);
    script.onerror = function(error) { console.log(error); };
    script.onload = script.onreadystatechange = function(_, isAbort) {
        if (isAbort || !script.readyState || /loaded|compvare/.test(script.readyState)) {
            script.onload = script.onreadystatechange = null;
            script = undefined;

            if (!isAbort) {
                done();
            }
        }
    };

    script.src = source;
}

function loadNonWorkerAsset(assets, current, done) {
    if(current >= assets.length) {
        if(done)
            done();
        return;
    }
    strictGetScript(assets[current], function() {
        console.log(assets[current]);
        loadNonWorkerAsset(assets, current + 1, done);
    })
}

function loadAssets(assets, done) {
    if (globalWorkerId == undefined) {
        loadNonWorkerAsset(assets, 0, done);
    }
    else {
        for (var i = 0; i < assets.length; i++) {
            importScripts(assets[i]);
        }
        if (done)
            done();
    }
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

var _globalFloatPool = [];

function newFloat64Array(size) {
    var arr = new Float64Array(size);
    _globalFloatPool.push(arr);
    return arr;
}

function deleteFloat64Array(array) {
    for(var i = 0; i < _globalFloatPool.length; i++) {
        if(_globalFloatPool[i] == array) {
            _globalFloatPool.splice(i, 1);
            break;
        }
    }
}