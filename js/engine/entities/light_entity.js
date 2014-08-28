inherit(Entity, LightEntity);

function LightEntity(options) {
    Entity.call(this, options);

    this.diffuse = vec3create(1.0, 1.0, 1.0);
    this.specular = vec3create(1.0, 1.0, 1.0);
    this.boundingRadius = 10.0;
    this.strength = 50.0;

    $.extend(true, this, options);
}

LightEntity.editableProperties = Entity.editableProperties.concat([
    { name: 'diffuse', friendly: 'Diffuse', type: 'vector' },
    { name: 'specular', friendly: 'Specular', type: 'vector' },
    { name: 'strength', friendly: 'Strength', type: 'float' }
]).filter(function (element) {
    return element.name != 'angle';
});

classes['LightEntity'] = LightEntity;

LightEntity.prototype.serialize = function () {
    var r = Entity.prototype.serialize.call(this);

    r.diffuse = this.diffuse;
    r.specular = this.specular;
    r.strength = this.strength;

    return r;
};

LightEntity.deserialize = function (data, map, entity) {
    entity = Entity.deserialize(data, map, entity);

    entity.diffuse = data.diffuse;
    entity.specular = data.specular;
    entity.strength = data.strength;

    return entity;
};