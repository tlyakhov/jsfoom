inherit(RenderableEntity, SpriteEntity);

function SpriteEntity(options) {
    RenderableEntity.call(this, options);

    $.extend(true, this, options);
}

classes['SpriteEntity'] = SpriteEntity;

SpriteEntity.editableProperties = RenderableEntity.editableProperties;

SpriteEntity.prototype.frame = function (lastFrameTime) {
    RenderableEntity.prototype.frame.call(this, lastFrameTime);
};

SpriteEntity.prototype.hurt = function (amount) {
    RenderableEntity.prototype.hurt.call(this, amount);
};

SpriteEntity.deserialize = RenderableEntity.deserialize;