inherit(EngineObject, Behavior);

function Behavior(options) {
    EngineObject.call(this, options);

    this.entity = null;
    this.active = true;

    $.extend(true, this, options);
}

Behavior.editorHidden = true;
Behavior.editableProperties = EngineObject.editableProperties.concat([
    { name: 'active', friendly: 'Active', type: 'bool' }
]);

classes['Behavior'] = Behavior;

Behavior.prototype.frame = function (lastFrameTime) {
};

Behavior.deserialize = function (data, entity, behavior) {
    behavior = EngineObject.deserialize(data, behavior);

    behavior.entity = entity;

    return behavior;
};