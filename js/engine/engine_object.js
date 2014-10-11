function EngineObject(options) {
    this.id = this.constructor.name + "_" + (new ObjectId().toString());
    this.tags = [];

    if(options)
        $.extend(true, this, options);
}

EngineObject.editableProperties = [
    { name: 'id', friendly: 'ID', type: 'string' },
    { name: 'tags', friendly: 'Tags', type: 'tags' }
];

EngineObject.prototype.serialize = function() {
    return {
        _type: this.constructor.name,
        id: this.id,
        tags: this.tags.slice(0)
    };
};

EngineObject.deserialize = function(data, object) {
    if (!object || object.constructor.name != data._type)
        object = createFromName(data._type, {});

    object.id = data.id;
    object.tags = data.tags;

    return object;
};