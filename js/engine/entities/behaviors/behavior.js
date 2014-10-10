function Behavior(options) {
    this.id = "Behavior_" + (new ObjectId().toString());
    this.entity = null;
    this.resetEntity = null;
    this.resetSector = null;

    $.extend(true, this, options);
}

Behavior.editableProperties = [
    { name: 'id', friendly: 'ID', type: 'string' }
];

classes['Behavior'] = Behavior;

Behavior.prototype.reset = function () {
    if (this.resetEntity == null)
        return; // Already reset

    var e = Entity.deserialize(this.resetEntity, this.entity.map);

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

Behavior.prototype.serialize = function () {
    var r = {
        _type: this.constructor.name,
        id: this.id
    };

    return r;
};

Behavior.deserialize = function (data, entity, behavior) {
    if (!behavior || behavior.constructor.name != data._type)
        behavior = createFromName(data._type, {});

    behavior.id = data.id;
    behavior.entity = entity;

    return behavior;
};