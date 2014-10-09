inherit(Entity, LightEntity);

function LightEntity(options) {
    Entity.call(this, options);

    this.behaviors = [ new LightBehavior({ entity: this }) ];
    this.boundingRadius = 10.0;

    $.extend(true, this, options);
}

LightEntity.editableProperties = Entity.editableProperties.filter(function (element) {
    return element.name != 'angle';
});

classes['LightEntity'] = LightEntity;

LightEntity.deserialize = function (data, map, entity) {
    return Entity.deserialize(data, map, entity);
};