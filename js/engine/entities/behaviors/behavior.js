inherit(EngineObject, Behavior);

function Behavior(options) {
    EngineObject.call(this, options);

    this.entity = null;
    this.resetEntity = null;
    this.resetSector = null;
    this.active = true;

    $.extend(true, this, options);
}

Behavior.editorHidden = true;
Behavior.editableProperties = EngineObject.editableProperties.concat([
    { name: 'active', friendly: 'Active', type: 'bool' }
]);

classes['Behavior'] = Behavior;

Behavior.prototype.reset = function () {
    if (this.resetEntity == null)
        return; // Already reset

    var e = classes[this.resetEntity._type].deserialize(this.resetEntity, this.entity.map);

    var sector = this.entity.sector;
    e.sector = this.resetSector;

    var index = $.inArray(this.entity, sector.entities);
    if (index != -1)
        sector.entities.splice(index, 1);

    if (this.resetSector)
        this.resetSector.entities.push(e);
    this.entity = e;
    e.collide();
};

Behavior.prototype.frame = function (lastFrameTime) {
    if (this.entity && this.resetEntity == null) {
        this.resetEntity = this.entity.serialize();
        this.resetSector = this.entity.sector;
    }
};

Behavior.deserialize = function (data, entity, behavior) {
    behavior = EngineObject.deserialize(data, behavior);

    behavior.entity = entity;

    return behavior;
};