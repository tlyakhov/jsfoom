'use strict';

inherit(EngineObject, Sprite);

function Sprite(options) {
    EngineObject.call(this, options);

    this.textureSrc = 'data/bricks.png';
    this.texture = null;
    this.state = 'idle';
    this.frame = 0;
    this.angle = 0;

    $.extend(true, this, options);
}

classes['Sprite'] = Sprite;

Sprite.editableProperties = EngineObject.editableProperties.concat([
    { name: 'textureSrc', friendly: 'textureSrc', type: 'string' },
    { name: 'state', friendly: 'State', type: 'string' },
    { name: 'frame', friendly: 'Frame', type: 'float' },
    { name: 'angle', friendly: 'Angle', type: 'float' }
]).filter(function(prop) { return prop.name != 'id' });

Sprite.prototype.getTexture = function () {
    if (!this.textureSrc)
        return null;

    if (!this.texture || this.texture.src != this.textureSrc)
        this.texture = textureCache.get({ src: this.textureSrc, generateMipMaps: true, filter: false });

    return this.texture;
};

Sprite.prototype.serialize = function () {
    var r = EngineObject.prototype.serialize.call(this);
    r.textureSrc = this.textureSrc;
    r.angle = this.angle;
    r.frame = this.frame;
    r.state = this.state;

    return r;
};

Sprite.deserialize = function (data, sprite) {
    sprite = EngineObject.deserialize(data, sprite);

    sprite.textureSrc = data.textureSrc;
    sprite.angle = data.angle;
    sprite.frame = data.frame;
    sprite.state = data.state;

    return sprite;
};