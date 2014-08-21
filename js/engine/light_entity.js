LightEntity.prototype = new Entity();
LightEntity.prototype.constructor = LightEntity;
LightEntity.prototype.parent = Entity.prototype;

function LightEntity(options) {
    this.parent.constructor.call(this, options);

    this.diffuse = vec3create(1.0, 1.0, 1.0);
    this.specular = vec3create(1.0, 1.0, 1.0);
    this.radius = 5.0;
    this.strength = 100.0;
    this.renderable = false;
    this.marked = false;

    $.extend(true, this, options);
}
