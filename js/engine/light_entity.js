LightEntity.prototype = new Entity();
LightEntity.prototype.constructor = LightEntity;
LightEntity.prototype.parent = Entity.prototype;

function LightEntity(options) {
    this.parent.constructor.call(this, options);

    this.diffuse = vec3create(1.0, 1.0, 1.0);
    this.specular = vec3create(1.0, 1.0, 1.0);
    this.boundingRadius = 5.0;
    this.strength = 100.0;
    this.renderable = false;
    this.marked = false;
    //this.vel[2] = 0.5;

    $.extend(true, this, options);
}

LightEntity.editableProperties = Entity.editableProperties;

classes['LightEntity'] = LightEntity;

/*LightEntity.prototype.frame = function (lastFrameTime) {
 this.parent.frame.call(this, lastFrameTime);

 if(this.pos[2] <= this.sector.bottomZ)
 this.vel[2] = 0.5;
 if(this.pos[2] >= this.sector.topZ)
 this.vel[2] = -0.5;
 };*/

LightEntity.prototype.serialize = function () {
    var r = this.parent.serialize.call(this);

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