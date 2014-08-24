StaticEntity.prototype = new Entity();
StaticEntity.prototype.constructor = StaticEntity;
StaticEntity.prototype.parent = Entity.prototype;

function StaticEntity(options) {
    this.parent.constructor.call(this, options);

    $.extend(true, this, options);
}

classes['StaticEntity'] = StaticEntity;

StaticEntity.prototype.frame = function (lastFrameTime) {
    this.parent.frame.call(this, lastFrameTime);
};

StaticEntity.prototype.hurt = function (amount) {
    this.parent.hurt.call(this, amount);
};

StaticEntity.deserialize = Entity.deserialize;