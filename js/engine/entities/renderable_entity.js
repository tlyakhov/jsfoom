inherit(Entity, RenderableEntity);

function RenderableEntity(options) {
    Entity.call(this, options);

    this.width = 64.0;
    this.height = 64.0;
    this.sprites = {};
    this.zOffset = 0.0;

    $.extend(true, this, options);
}

classes['RenderableEntity'] = RenderableEntity;

RenderableEntity.editableProperties = Entity.editableProperties.concat([
    { name: 'width', friendly: 'Width', type: 'float' },
    { name: 'height', friendly: 'Height', type: 'float' },
    { name: 'zOffset', friendly: 'Vertical Offset', type: 'float' }
]);


RenderableEntity.prototype.getSprite = function (angle) {
    var index = fast_floor(angle * Object.keys(this.sprites).length / 360.0);

    return this.sprites[index];
};

RenderableEntity.prototype.serialize = function () {
    var r = Entity.prototype.serialize.call(this);

    r.width = this.width;
    r.height = this.height;
    r.zOffset = this.zOffset;
    r.sprites = {};

    for (var s in this.sprites) {
        r.sprites[s] = this.sprites[s].serialize();
    }

    return r;
};

RenderableEntity.deserialize = function (data, map, entity) {
    entity = Entity.deserialize(data, map, entity);

    entity.width = data.width;
    entity.height = data.height;
    entity.zOffset = data.zOffset;

    for (var s in data.sprites) {
        entity.sprites[s] = Sprite.deserialize(data.sprites[s], entity.sprites[s]);
    }

    return entity;
};