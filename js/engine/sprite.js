function Sprite(options) {
    this.textureSrc = 'data/bricks.png';
    this.texture = null;
    this.state = 'idle';
    this.frame = 0;
    this.angle = 0;

    $.extend(true, this, options);
}

classes['Sprite'] = Sprite;

Sprite.prototype.getTexture = function () {
    if (!this.textureSrc)
        return null;

    if (!this.texture || this.texture.src != this.textureSrc)
        this.texture = textureCache.get(this.textureSrc, true, false);

    return this.texture;
};

Sprite.prototype.serialize = function () {
    var r = {
        textureSrc: this.textureSrc,
        angle: this.angle,
        frame: this.frame,
        state: this.state
    };

    return r;
};

Sprite.deserialize = function (data, sprite) {
    if (!sprite)
        sprite = new Sprite();

    sprite.textureSrc = data.textureSrc;
    sprite.angle = data.angle;
    sprite.frame = data.frame;
    sprite.state = data.state;

    return sprite;
};