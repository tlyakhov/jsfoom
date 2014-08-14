LightEntity.prototype = new Entity();
LightEntity.prototype.constructor = LightEntity;
LightEntity.prototype.parent = Entity.prototype;

function LightEntity(options) {
    this.parent.constructor.call(this, options);

    this.diffuse = new Vector3(1.0, 1.0, 1.0);
    this.specular = new Vector3(1.0, 1.0, 1.0);

    $.extend(true, this, options);
}
