importScripts("../lib/jquery.nodom.js");
importScripts("../lib/object_id.js");
importScripts("../game/constants.js");
importScripts("utils.js");
importScripts("object_cache.js");
importScripts("vector3.js");
importScripts("texture.js");
importScripts("texture_cache.js");
importScripts("material.js");
importScripts("map_segment.js");
importScripts("map_sector.js");
importScripts("map_sector_water.js");
importScripts("map_sector_vertical_door.js");
importScripts("sprite.js");
importScripts("entity.js");
importScripts("static_entity.js");
importScripts("light_entity.js");
importScripts("player.js");
importScripts("map.js");
importScripts("render_slice.js");
importScripts("renderer.js");

var renderer = null;
var globalRenderTarget = null;
var globalWorkerId = 0;
var globalWorkersTotal = 0;

onmessage = function (e) {
    var data = e.data;

    if (data.type == 'init') {
        globalWorkerId = data.id;
        globalWorkersTotal = data.workers;
        renderer = new Renderer({ screenWidth: data.screenWidth, screenHeight: data.screenHeight });
        globalRenderTarget = new Uint32Array(data.screenWidth * data.screenHeight / globalWorkersTotal);
    }
    else if (data.type == 'setTextureData') {
        var texture = textureCache.get(data.texture.src, data.texture.generateMipMaps, data.texture.filter);
        texture.data = data.data;
        texture.width = data.texture.width;
        texture.height = data.texture.height;
        texture.loaded(null, null);
    }
    else if (data.type == 'render') {
        var stime = performance.now();
        map = Map.deserialize(data.map);
        var dstime = Math.round(performance.now() - stime);

        renderer.render(globalRenderTarget);

        postMessage({ id: globalWorkerId, type: 'rendered', data: globalRenderTarget, dstime: dstime });
    }
};
