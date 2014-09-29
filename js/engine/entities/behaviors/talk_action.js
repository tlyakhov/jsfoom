function TalkAction(options) {
    this.id = "TalkAction_" + (new ObjectId().toString());
    this.delay = 3000;
    this.behavior = null;

    $.extend(true, this, options);
}

TalkAction.editableProperties = {};

classes['TalkAction'] = TalkAction;

TalkAction.prototype.act = function () {

};

TalkAction.prototype.serialize = function () {
    var r = {
        _type: this.constructor.name,
        id: this.id,
        delay: this.delay
    };

    return r;
};

TalkAction.deserialize = function (data, behavior, talkAction) {
    if (!talkAction)
        talkAction = createFromName(data._type, {});

    if (talkAction.constructor.name != data._type) {
        talkAction.__proto__ = classes[data._type];
    }

    talkAction.id = data.id;
    talkAction.delay = data.delay;
    talkAction.behavior = behavior;

    return talkAction;
};