inherit(RenderableEntity, SpriteEntity);

function SpriteEntity(options) {
    RenderableEntity.call(this, options);

    this.width = 64.0;
    this.height = 64.0;
    this.sprites = [];
    this.spriteState = 'idle';
    this.spriteHash = {};
    this.spriteCounts = {};
    this.spriteFrame = 0;
    this.zOffset = 0.0;

    $.extend(true, this, options);
}

classes['SpriteEntity'] = SpriteEntity;

SpriteEntity.editableProperties = RenderableEntity.editableProperties.concat([
    { name: 'width', friendly: 'Width', type: 'float' },
    { name: 'height', friendly: 'Height', type: 'float' },
    { name: 'zOffset', friendly: 'Vertical Offset', type: 'float' },
    { name: 'spriteState', friendly: 'Sprite State', type: 'string' },
    { name: 'sprites', friendly: 'Sprites', type: 'array', childType: 'Sprite' }
]);

SpriteEntity.prototype.getSprite = function (angle) {
    if(!this.spriteCounts[this.spriteState + '_angle']) {
        var angles = {};
        var frames = {};
        for(var i = 0; i < this.sprites.length; i++) {
            if(this.sprites[i].state != this.spriteState)
                continue;

            angles[this.sprites[i].angle] = true;
            frames[this.sprites[i].frame] = true;
        }
        this.spriteCounts[this.spriteState + '_angle'] = Object.keys(angles).length;
        this.spriteCounts[this.spriteState + '_frame'] = Object.keys(frames).length;
    }

    if(this.spriteCounts[this.spriteState + '_angle'] == 0 || this.spriteCounts[this.spriteState + '_frame'] == 0)
        return null;

    var aIndex = fast_floor(angle * this.spriteCounts[this.spriteState + '_angle'] / 360.0);
    var fIndex = this.spriteFrame % this.spriteCounts[this.spriteState + '_frame'];

    var key = this.spriteState + '_' + aIndex + '_' + fIndex;

    if(!this.spriteHash[key]) {
        for(var i = 0; i < this.sprites.length; i++) {
            if(this.sprites[i].state == this.spriteState && this.sprites[i].angle == aIndex && this.sprites[i].frame == fIndex) {
                this.spriteHash[key] = this.sprites[i];
                break;
            }
        }
    }

    return this.spriteHash[key];
};

SpriteEntity.prototype.frame = function(lastFrameTime) {
    Entity.prototype.frame.call(this, lastFrameTime);

    this.spriteFrame++;
};

SpriteEntity.prototype.serialize = function() {
    var r = RenderableEntity.prototype.serialize.call(this);

    r.width = this.width;
    r.height = this.height;
    r.zOffset = this.zOffset;
    r.spriteState = this.spriteState;
    r.sprites = [];

    for(var i = 0; i < this.sprites.length; i++) {
        r.sprites.push(this.sprites[i].serialize());
    }

    return r;
};

SpriteEntity.deserialize = function(data, map, entity) {
    entity = RenderableEntity.deserialize(data, map, entity);

    entity.width = data.width;
    entity.height = data.height;
    entity.zOffset = data.zOffset;
    entity.spriteState = data.spriteState;

    entity.spriteHash = {};

    if (!entity.sprites)
        entity.sprites = [];

    for (var i = 0; i < data.sprites.length; i++) {
        if (i >= entity.sprites.length)
            entity.sprites.push(Sprite.deserialize(data.sprites[i]));
        else
            entity.sprites[i] = Sprite.deserialize(data.sprites[i], entity.sprites[i]);
    }

    if (entity.sprites.length > data.sprites.length)
        entity.sprites.splice(data.sprites.length, entity.sprites.length - data.sprites.length);

    return entity;
};