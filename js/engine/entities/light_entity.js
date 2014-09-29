inherit(Entity, LightEntity);

function LightEntity(options) {
    Entity.call(this, options);

    this.diffuse = vec3create(1.0, 1.0, 1.0);
    this.boundingRadius = 10.0;
    this.strength = 50.0;
    this.marked = true;

    $.extend(true, this, options);
}

LightEntity.editableProperties = Entity.editableProperties.concat([
    { name: 'diffuse', friendly: 'Diffuse', type: 'vector' },
    { name: 'strength', friendly: 'Strength', type: 'float' }
]).filter(function (element) {
    return element.name != 'angle';
});

classes['LightEntity'] = LightEntity;

LightEntity.prototype.frame = function (lastFrameTime) {
    var lastPos = vec3clone(this.pos, true);

    Entity.prototype.frame.call(this, lastFrameTime);

    if (this.pos[0] != lastPos[0] || this.pos[1] != lastPos[1] || this.pos[2] != lastPos[2])
        this.map.clearLightmaps();
};

LightEntity.prototype.serialize = function () {
    var r = Entity.prototype.serialize.call(this);

    r.diffuse = this.diffuse;
    r.strength = this.strength;

    return r;
};

LightEntity.deserialize = function (data, map, entity) {
    entity = Entity.deserialize(data, map, entity);

    entity.diffuse = data.diffuse;
    entity.strength = data.strength;

    return entity;
};