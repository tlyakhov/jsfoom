inherit(RenderableEntity, StaticEntity);

function StaticEntity(options) {
    RenderableEntity.call(this, options);

    $.extend(true, this, options);
}

classes['StaticEntity'] = StaticEntity;

StaticEntity.editableProperties = RenderableEntity.editableProperties;

StaticEntity.prototype.frame = function (lastFrameTime) {
    RenderableEntity.prototype.frame.call(this, lastFrameTime);
};

StaticEntity.prototype.hurt = function (amount) {
    RenderableEntity.prototype.hurt.call(this, amount);
};

StaticEntity.deserialize = RenderableEntity.deserialize;