function EngineObject(options) {
    this.id = this.constructor.name + "_" + (new ObjectId().toString());

    if(options)
        $.extend(true, this, options);
}

EngineObject.editableProperties = [
    { name: 'id', friendly: 'ID', type: 'string' }
];

EngineObject.prototype.serialize = function() {
    return {
        _type: this.constructor.name,
        id: this.id
    };
};

EngineObject.deserialize = function(data, object) {
    if (!object || object.constructor.name != data._type)
        object = createFromName(data._type, {});

    object.id = data.id;

    return object;
};