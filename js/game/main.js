'use strict';

var globalWorkerId = undefined; // We're not a worker

function GameMain(options) {
    this.canvasId = null;
    this.loadedCallback = null;
    this.map = null;
    this.renderer = null;
    this.prevTime = preciseTime();
    this.curTime = preciseTime();
    this.lastGameTime = 0;
    this.prevRenderTime = preciseTime();
    this.curRenderTime = preciseTime();
    this.lastFrameTime = 0;
    this.renderContext = null;
    this.screenWidth = null;
    this.screenHeight = null;
    this.frameTint = 0;
    this.renderImgData = null;
    this.renderBuffer = null;
    this.renderBuffer8 = null;
    this.renderTarget = null;
    this.touchStart = vec3blank();
    this.workers = [];
    this.workerFrameReady = [];
    this.workerDbgMeasure = [];
    this.pickCallback = null;
    this.prevKeys = {};
    this.keys = {};
    this.gameTextQueue = [ ];
    this.state = 'game';
    this.talkActionQuestion = null;
    this.talkActionAnswerCallback = null;

    $.extend(true, this, options);
}

GameMain.prototype.go = function () {
    loadAssets(GAME_CONSTANTS.codeAssets, $.proxy(function() {
        if(!this.map) {
            this.map = Map.deserialize(window[GAME_CONSTANTS.firstMap]);
        }

        var canvas = $('#' + this.canvasId);
        canvas.attr('width', this.screenWidth);
        canvas.attr('height', this.screenHeight + 64);
        canvas.on('mousedown', $.proxy(this.onCanvasClick, this));
        canvas.on('touchstart', $.proxy(this.onTouchStart, this));
        canvas.on('touchmove', $.proxy(this.onTouchMove, this));
        canvas.on('touchend', $.proxy(this.onTouchEnd, this));

        this.renderContext = document.getElementById(this.canvasId).getContext('2d');
        this.renderImgData = this.renderContext.createImageData(this.screenWidth, this.screenHeight);
        this.renderBuffer = new ArrayBuffer(this.renderImgData.data.length);
        this.renderBuffer8 = new Uint8ClampedArray(this.renderBuffer);
        this.renderTarget = new Uint32Array(this.renderBuffer);

        for (var i = 0; i < GAME_CONSTANTS.renderWorkers; i++) {
            var worker = new Worker('js/engine/render_worker.js');
            worker.onmessage = $.proxy(this.onWorkerMessage, this);
            worker.onerror = $.proxy(this.onWorkerError, this);
            worker.postMessage({ id: i,
                type: 'init',
                screenWidth: this.screenWidth,
                screenHeight: this.screenHeight,
                workers: GAME_CONSTANTS.renderWorkers,
                assets: GAME_CONSTANTS.codeAssets });
            this.workers.push(worker);
            this.workerFrameReady.push(true);
            this.workerDbgMeasure.push(0);
        }

        //if (this.workers.length == 0) {
        this.renderer = new Renderer({ canvas: this.canvasId, map: this.map, screenWidth: this.screenWidth, screenHeight: this.screenHeight });
        //}

        this.checkRenderWorkers();


        setInterval($.proxy(this.timer, this), 16);

        if(this.loadedCallback)
            this.loadedCallback();
    }, this));
};

GameMain.prototype.onTouchStart = function(evt) {
    evt.preventDefault();
    this.touchStart[0] = evt.originalEvent.touches[0].clientX;
    this.touchStart[1] = evt.originalEvent.touches[0].clientY;
//    console.log(evt);
};

GameMain.prototype.onTouchMove = function(evt) {
    evt.preventDefault();
    var dx = evt.originalEvent.touches[0].clientX - this.touchStart[0];
    var dy = evt.originalEvent.touches[0].clientY - this.touchStart[1];

    if(this.state == 'game') {
        this.map.player.angle += dx / 5 * GAME_CONSTANTS.playerTurnSpeed * this.lastGameTime / 30.0;
        this.map.player.angle = fast_floor(normalizeAngle(this.map.player.angle));
        this.map.player.move(this.map.player.angle, 0, -dy / 5);
        this.touchStart[0] = evt.originalEvent.touches[0].clientX;
        this.touchStart[1] = evt.originalEvent.touches[0].clientY;
    }
};

GameMain.prototype.onTouchEnd = function(evt) {
    evt.preventDefault();
//    console.log(evt);
};

GameMain.prototype.onCanvasClick = function (evt) {
    var canvas = document.getElementById(this.canvasId);
    var rect = canvas.getBoundingClientRect();
    var x = fast_floor((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
    var y = fast_floor((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);

    if(this.pickCallback) {
        this.pickCallback(this.renderer.pick(x, y));
    }
};

GameMain.prototype.onTextureLoad = function (worker, texture) {
    for (var i = 0; i < this.workers.length; i++) {
        this.workers[i].postMessage({
            type: 'setTextureData',
            texture: texture.serialize(),
            data: texture.data
        });
    }
};

GameMain.prototype.drawText = function (text, x, y, style, opacity) {
    this.renderContext.fillStyle = '#FFF';
    if (opacity != undefined)
        this.renderContext.globalAlpha = opacity * 0.5;
    else
        this.renderContext.globalAlpha = 0.5;
    this.renderContext.fillText(text, x + 0.5, y + 0.5);
    if (style)
        this.renderContext.fillStyle = style;
    else
        this.renderContext.fillStyle = '#000';

    if (opacity != undefined)
        this.renderContext.globalAlpha = opacity;
    else
        this.renderContext.globalAlpha = 1.0;
    this.renderContext.fillText(text, x, y);
};

GameMain.prototype.gameText = function () {
    this.renderContext.textAlign = 'center';
    this.renderContext.font = 'bold 12px "Share Tech Mono"';
    // Now for game text
    for (var i = 0; i < this.gameTextQueue.length; i++) {
        var gt = this.gameTextQueue[i];
        if (!gt.opacity)
            gt.opacity = 1.0;
        if (!gt.time)
            gt.time = preciseTime();
        var delta = preciseTime() - gt.time;
        if (delta > GAME_CONSTANTS.maxGameTextTime)
            gt.opacity = Math.max(0.0, 1.0 - (delta - GAME_CONSTANTS.maxGameTextTime) / GAME_CONSTANTS.gameTextFadeTime);
        if (gt.opacity == 0.0) {
            this.gameTextQueue.splice(i, 1);
            i--;
            continue;
        }
        this.drawText(gt.text, this.screenWidth / 2, this.screenHeight / 2 - (this.gameTextQueue.length - 1 - i) * 16, gt.fillStyle, gt.opacity);
    }

    while (this.gameTextQueue.length > GAME_CONSTANTS.maxGameText)
        this.gameTextQueue.shift();

    if (this.state == 'question' && this.talkActionQuestion) {
        for (var j = 0; j < this.talkActionQuestion.options.length; j++) {
            var option = this.talkActionQuestion.options[j];
            this.drawText('[' + (j + 1) + '] ' + option.text, this.screenWidth / 2, this.screenHeight / 2 + 16 + j * 16, option.fillStyle, 1.0);
        }
    }

};

GameMain.prototype.infoBar = function () {
    var infoBarTexture = textureCache.get({ src: GAME_CONSTANTS.infoBarSrc, generateMipMaps: false, filter: false });
    this.renderContext.drawImage(infoBarTexture.img, 0, this.screenHeight - 1);
    var avatarTexture = textureCache.get({ src: GAME_CONSTANTS.avatarSrc, generateMipMaps: false, filter: false });
    this.renderContext.drawImage(avatarTexture.img, 320 - 32, this.screenHeight - 1, 64, 64);

    for (var i = 0; i < this.map.player.inventory.length; i++) {
        var item = this.map.player.inventory[i];

        if (!item.entity.sprites || item.entity.sprites.length == 0)
            continue;

        var sprite = item.entity.sprites[0];
        var st = sprite.getTexture();

        this.renderContext.drawImage(st.img, 355 + i * 64, this.screenHeight, 64, 64);
    }
};

GameMain.prototype.flipBuffers = function () {
    this.renderContext.globalAlpha = 1.0;

    if (this.frameTint != 0) {
        for (var i = 0; i < this.screenWidth * this.screenHeight; i++) {
            this.renderTarget[i] = colorTint(this.renderTarget[i], this.frameTint);
        }
    }

    if (this.state != 'game') {
        for (var i = 0; i < this.screenWidth * this.screenHeight; i++) {
            this.renderTarget[i] = color2bw(this.renderTarget[i]);
        }
    }

    this.renderImgData.data.set(this.renderBuffer8);
    this.renderContext.putImageData(this.renderImgData, 0, 0);

    if (this.state == 'game' || this.state == 'question')
        this.gameText();

    this.infoBar();

    if (this.state == 'paused') {
        this.renderContext.textAlign = 'center';
        this.renderContext.font = 'normal bold 20px "Share Tech Mono"';
        this.renderContext.fillStyle = '#FFF';
        this.renderContext.fillText('PAUSED', this.screenWidth / 2, 25);
    }

    // Debug stuff follows
    if (GAME_CONSTANTS.debugLevel > 0) {
        this.renderContext.textAlign = 'left';
        this.renderContext.globalAlpha = 1.0;
        this.renderContext.fillStyle = '#FFF';
        this.renderContext.fillText('Game FPS: ' + Math.round(1000.0 / this.lastGameTime), 5, 15);
        this.renderContext.fillText('Render FPS: ' + Math.round(1000.0 / this.lastFrameTime) + (this.renderer ? ', counter: ' + this.renderer.counter : ''), 5, 25);
        if (this.map.player.sector) {
            this.renderContext.fillText('Current sector: ' + this.map.player.sector.id +
                ', x: ' + Math.round(this.map.player.pos[0]) +
                ', y: ' + Math.round(this.map.player.pos[1]) +
                ', z: ' + Math.round(this.map.player.pos[2]), 5, 35);
        }
        this.renderContext.fillText('Health: ' + this.map.player.health, 5, 45);

        if (GAME_CONSTANTS.debugLevel > 1) {
            for (var i = 0; i < this.workerDbgMeasure.length; i++) {
                this.renderContext.fillText('Worker ' + i + ' render time: ' + this.workerDbgMeasure[i] + ' ms', 5, 55 + i * 10);
            }
        }
    }

    this.curRenderTime = preciseTime();
    this.lastFrameTime = (this.curRenderTime - this.prevRenderTime);
    this.prevRenderTime = this.curRenderTime;
};

GameMain.prototype.checkRenderWorkers = function () {
    var count = 0;
    var ix = this.workerFrameReady.length;
    while (ix--) {
        if (this.workerFrameReady[ix])
            count++;
    }

    if (count != this.workerFrameReady.length)
        return;

    this.flipBuffers();

    var serializedMap = this.map.serialize();

    for (var i = 0; i < this.workerFrameReady.length; i++) {
        if (this.workerFrameReady[i]) {
            this.workerFrameReady[i] = false;
            this.workers[i].postMessage({ type: 'render', map: serializedMap });
        }
    }
};

GameMain.prototype.resetRenderWorkers = function () {
    for (var i = 0; i < this.workers.length; i++) {
        this.workers[i].postMessage({ type: 'reset' });
    }
};

GameMain.prototype.onWorkerMessage = function (e) {
    var data = e.data;

    if (data.type == 'getTextureData') {
        var fn = function (texture) {
            this.onTextureLoad(e.target, texture);
        };
        var tex = textureCache.get({ src: data.texture.src, generateMipMaps: data.texture.generateMipMaps, filter: data.texture.filter, onLoad: $.proxy(fn, this) });
        if (tex.data.length > 0) {
            this.onTextureLoad(e.target, tex);
        }
    }
    else if (data.type == 'rendered') {
        this.workerDbgMeasure[data.id] = data.dstime;
        var wl = this.screenWidth / this.workers.length;
        var xStart = data.id * wl;
        var xEnd = xStart + wl;

        for (var x = xStart; x < xEnd; x++) {
            for (var y = 0; y < this.screenHeight; y++) {
                this.renderTarget[y * this.screenWidth + x] = data.data[y * wl + x - xStart];
            }
        }
        this.workerFrameReady[data.id] = true;

        this.checkRenderWorkers();
    }
};

GameMain.prototype.onWorkerError = function (e) {
    console.log(e);
};

GameMain.prototype.timer = function () {
    this.curTime = preciseTime();
    this.lastGameTime = (this.curTime - this.prevTime);
    this.prevTime = this.curTime;

    if (this.workers.length == 0) {
        this.renderer.render(this.renderTarget);
        this.flipBuffers();
    }

    this.checkInput();

    if (this.state == 'game')
        this.map.frame(this.lastGameTime);
};

GameMain.prototype.checkGameInput = function () {
    if (!this.keys[KEY_ESC] && this.prevKeys[KEY_ESC]) {
        this.state = 'paused';
        this.prevKeys[KEY_ESC] = false;
    }

    if (this.keys[KEY_W]) {
        this.map.player.move(this.map.player.angle, this.lastGameTime);
    }

    if (this.keys[KEY_S]) {
        this.map.player.move(this.map.player.angle + 180.0, this.lastGameTime);
    }
    if (this.keys[KEY_Q]) {
        this.map.player.move(this.map.player.angle + 270.0, this.lastGameTime);
    }

    if (this.keys[KEY_E]) {
        this.map.player.move(this.map.player.angle + 90.0, this.lastGameTime);
    }

    if (this.keys[KEY_A]) {
        this.map.player.angle -= GAME_CONSTANTS.playerTurnSpeed * this.lastGameTime / 30.0;
        this.map.player.angle = fast_floor(normalizeAngle(this.map.player.angle));
    }

    if (this.keys[KEY_D]) {
        this.map.player.angle += GAME_CONSTANTS.playerTurnSpeed * this.lastGameTime / 30.0;
        this.map.player.angle = fast_floor(normalizeAngle(this.map.player.angle));
    }

    if (this.keys[KEY_SPACE]) {
        if (this.map.player.sector.constructor == MapSectorWater) {
            this.map.player.vel[2] += GAME_CONSTANTS.playerSwimStrength * this.lastGameTime / 30.0;
        }
        else if (this.map.player.standing && !this.prevKeys[KEY_SPACE]) {
            this.map.player.vel[2] += GAME_CONSTANTS.playerJumpStrength * this.lastGameTime / 30.0;
            this.prevKeys[KEY_SPACE] = true;
        }
    }

    if (this.keys[KEY_C]) {
        if (!this.map.player.standing && this.map.player.sector.constructor == MapSectorWater) {
            this.map.player.vel[2] -= GAME_CONSTANTS.playerSwimStrength * this.lastGameTime / 30.0;
        }
        else {
            this.map.player.crouching = true;
        }
    }
    else {
        this.map.player.crouching = false;
    }
};

GameMain.prototype.checkPausedInput = function () {
    if (!this.keys[KEY_ESC] && this.prevKeys[KEY_ESC]) {
        this.state = 'game';
        this.prevKeys[KEY_ESC] = false;
    }
};

GameMain.prototype.checkQuestionInput = function () {
    if (!this.talkActionQuestion)
        return;

    for (var i = 0; i < this.talkActionQuestion.options.length; i++) {
        var option = this.talkActionQuestion.options[i];

        if (!this.keys[KEY_1 + i] && this.prevKeys[KEY_1 + i]) {
            var gt = $.extend(true, {}, option);
            gt.text = 'You say "' + gt.text + '".';
            this.gameTextQueue.push(gt);
            this.state = 'game';
            this.prevKeys[KEY_1 + i] = false;
            if (this.talkActionAnswerCallback) {
                this.talkActionAnswerCallback(option);
                this.talkActionAnswerCallback = null;
            }
            this.talkActionQuestion = null;
            break;
        }
    }
};

GameMain.prototype.checkInput = function () {
    if (this.state == 'game')
        this.checkGameInput();
    else if (this.state == 'paused')
        this.checkPausedInput();
    else if (this.state == 'question')
        this.checkQuestionInput();
};