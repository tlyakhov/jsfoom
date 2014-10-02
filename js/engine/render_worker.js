importScripts("../lib/jquery.nodom.js");
importScripts("../lib/object_id.js");
importScripts("../lib/hashcode.js");
importScripts("../game/constants.js");
importScripts("utils.js");
importScripts("object_cache.js");
importScripts("vector3.js");
importScripts("texture.js");
importScripts("texture_cache.js");
importScripts("material.js");
importScripts("map_segment.js");
importScripts("sectors/map_sector.js");
importScripts("sectors/map_sector_water.js");
importScripts("sectors/map_sector_vertical_door.js");
importScripts("sprite.js");
importScripts("entities/entity.js");
importScripts("entities/renderable_entity.js");
importScripts("entities/static_entity.js");
importScripts("entities/light_entity.js");
importScripts("entities/behaviors/behavior.js");
importScripts("entities/behaviors/talk_behavior.js");
importScripts("entities/behaviors/wander_behavior.js");
importScripts("entities/behaviors/waypoint_behavior.js");
importScripts("entities/behaviors/talk_action.js");
importScripts("entities/behaviors/talk_action_print.js");
importScripts("player.js");
importScripts("map.js");
importScripts("render_slice.js");
importScripts("renderer.js");

var renderer = null;
var globalRenderTarget = null;
var globalWorkerId = 0;
var globalWorkersTotal = 0;
var globalGame = null; // We're a worker!
var map = null;

onmessage = function (e) {
    var data = e.data;

    if (data.type == 'init') {
        globalWorkerId = data.id;
        globalWorkersTotal = data.workers;
        renderer = new Renderer({ screenWidth: data.screenWidth, screenHeight: data.screenHeight });
        globalRenderTarget = new Uint32Array(data.screenWidth * data.screenHeight / globalWorkersTotal);
    }
    else if (data.type == 'reset') {
        renderer.map = map = new Map();
    }
    else if (data.type == 'setTextureData') {
        var texture = textureCache.get(data.texture.src, data.texture.generateMipMaps, data.texture.filter);
        texture.data = data.data;
        texture.width = data.texture.width;
        texture.height = data.texture.height;
        texture.loaded(null, null);
    }
    else if (data.type == 'render') {
        renderer.map = map = Map.deserialize(data.map, renderer.map);

        var stime = preciseTime();
        renderer.render(globalRenderTarget);
        var dstime = Math.round(preciseTime() - stime);

        postMessage({ id: globalWorkerId, type: 'rendered', data: globalRenderTarget, dstime: dstime });
    }
};
