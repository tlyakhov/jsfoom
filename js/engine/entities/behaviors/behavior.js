function Behavior(options) {
    this.id = "Behavior_" + (new ObjectId().toString());
    this.entity = null;

    $.extend(true, this, options);
}

Behavior.editableProperties = {};

classes['Behavior'] = Behavior;

Behavior.prototype.reset = function () {

};

Behavior.prototype.frame = function () {

};

Behavior.prototype.serialize = function () {
    var r = {
        _type: this.constructor.name,
        id: this.id
    };

    return r;
};

Behavior.deserialize = function (data, entity, behavior) {
    if (!behavior)
        behavior = createFromName(data._type, {});

    if (behavior.constructor.name != data._type) {
        behavior.__proto__ = classes[data._type];
    }

    behavior.id = data.id;
    behavior.entity = entity;

    return behavior;
};