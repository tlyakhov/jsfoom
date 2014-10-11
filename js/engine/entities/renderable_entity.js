inherit(Entity, RenderableEntity);

function RenderableEntity(options) {
    Entity.call(this, options);

    this.visible = true;

    $.extend(true, this, options);
}

classes['RenderableEntity'] = RenderableEntity;

RenderableEntity.editorHidden = true;
RenderableEntity.editableProperties = Entity.editableProperties.concat([
    { name: 'visible', friendly: 'Visible', type: 'bool' }
]);

RenderableEntity.prototype.serialize = function () {
    var r = Entity.prototype.serialize.call(this);

    r.visible = this.visible;

    return r;
};

RenderableEntity.deserialize = function (data, map, entity) {
    entity = Entity.deserialize(data, map, entity);

    entity.visible = data.visible;

    return entity;
};