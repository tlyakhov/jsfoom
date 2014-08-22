var map = testMap;
var renderer = null;
var prevTime = new Date().getTime();
var curTime = new Date().getTime();
var lastFrameTime = 0;
var globalCtx = null;
var globalScreenWidth = null;
var globalScreenHeight = null;
var globalImgData = null;
var globalRenderBuffer = null;
var globalRenderBuffer8 = null;
var globalRenderTarget = null;
var globalWorkers = [];
var globalWorkerId = undefined; // We're not a worker
var globalWorkerFrame = [];
var globalSerializedMap = null;

var workerTime = [];

function onTextureLoad(worker, texture) {
    for (var i = 0; i < globalWorkers.length; i++) {
        globalWorkers[i].postMessage({
            type: 'setTextureData',
            texture: texture.serialize(),
            data: texture.data
        });
    }
}

function flipBuffers() {
    globalImgData.data.set(globalRenderBuffer8);
    globalCtx.putImageData(globalImgData, 0, 0);

    globalCtx.fillStyle = '#FFF';
    globalCtx.fillText('FPS: ' + Math.round(1000.0 / lastFrameTime), 5, 15);
    globalCtx.fillText('Current sector: ' + map.player.sector.id +
        ', x: ' + Math.round(map.player.pos[0]) +
        ', y: ' + Math.round(map.player.pos[1]) +
        ', z: ' + Math.round(map.player.pos[2]), 5, 25);
    globalCtx.fillText('Health: ' + map.player.health, 5, 35);

    for (var i = 0; i < workerTime.length; i++) {
        globalCtx.fillText('Worker ' + i + ': ' + workerTime[i], 5, 45 + i * 10); //Math.round(1000.0 / (performance.now() - workerTime[i]))
//        workerTime[i] = performance.now();
    }
}

function checkRenderWorkers() {
    if (!globalSerializedMap)
        return;

    var count = 0;
    var ix = globalWorkerFrame.length;
    while (ix--) {
        if (globalWorkerFrame[ix])
            count++;
    }

    if (count == globalWorkerFrame.length) {
        flipBuffers();

        for (var i = 0; i < globalWorkerFrame.length; i++) {
            globalWorkerFrame[i] = false;
            globalWorkers[i].postMessage({ type: 'render', map: globalSerializedMap });
        }
    }
}

function onWorkerMessage(e) {
    var data = e.data;

    if (data.type == 'getTextureData') {
        var tex = textureCache.get(data.texture.src, data.texture.generateMipMaps, data.texture.filter, function (texture) {
            onTextureLoad(e.target, texture);
        });
        if (tex.data.length > 0) {
            onTextureLoad(e.target, tex);
        }
    }
    else if (data.type == 'rendered') {
        workerTime[data.id] = data.dstime;
        var wl = globalScreenWidth / globalWorkers.length;
        var xStart = data.id * wl;
        var xEnd = xStart + wl;

        for (var x = xStart; x < xEnd; x++) {
            for (var y = 0; y < globalScreenHeight; y++) {
                globalRenderTarget[y * globalScreenWidth + x] = data.data[y * wl + x - xStart];
            }
        }
        globalWorkerFrame[data.id] = true;

        checkRenderWorkers();
    }
}

function onWorkerError(e) {
    console.log(e);
}

function foomTimer() {
    curTime = performance.now();
    lastFrameTime = (curTime - prevTime);
    prevTime = curTime;

    if (globalWorkers.length == 0) {
        renderer.render(globalRenderTarget);
    }

    checkInput();

    map.frame(lastFrameTime);

    globalSerializedMap = map.serialize();
}

function foomInit() {
    globalCtx = document.getElementById('renderCanvas').getContext('2d');
    globalScreenWidth = $('#renderCanvas').width();
    globalScreenHeight = $('#renderCanvas').height();
    globalImgData = globalCtx.createImageData(globalScreenWidth, globalScreenHeight);
    globalRenderBuffer = new ArrayBuffer(globalImgData.data.length);
    globalRenderBuffer8 = new Uint8ClampedArray(globalRenderBuffer);
    globalRenderTarget = new Uint32Array(globalRenderBuffer);

    for (var i = 0; i < GAME_CONSTANTS.renderWorkers; i++) {
        var worker = new Worker('js/engine/render_worker.js');
        worker.onmessage = onWorkerMessage;
        worker.onerror = onWorkerError;
        worker.postMessage({ id: i,
            type: 'init',
            screenWidth: $('#renderCanvas').width(),
            screenHeight: $('#renderCanvas').height(),
            workers: GAME_CONSTANTS.renderWorkers });
        globalWorkers.push(worker);
        globalWorkerFrame.push(true);
        workerTime.push(performance.now());
    }

    if (globalWorkers.length == 0) {
        renderer = new Renderer({ canvas: '#renderCanvas' });
    }

    globalSerializedMap = map.serialize();
    checkRenderWorkers();

    setInterval(foomTimer, 16);
    //foomTimer();
}