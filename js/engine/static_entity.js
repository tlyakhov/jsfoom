StaticEntity.prototype = new Entity();
StaticEntity.prototype.constructor = StaticEntity;
StaticEntity.prototype.parent = Entity.prototype;

function StaticEntity(options) {
    this.parent.constructor.call(this, options);

    $.extend(true, this, options);
}

StaticEntity.prototype.frame = function (lastFrameTime) {
    this.parent.frame.call(this, lastFrameTime);

    this.angle += 4.0;
};

StaticEntity.prototype.hurt = function (amount) {
    this.parent.hurt.call(this, amount);
};