function TalkAction(options) {
    this.id = "TalkAction_" + (new ObjectId().toString());
    this.delay = 1000;
    this.behavior = null;
    this.gotoId = null;

    $.extend(true, this, options);
}

TalkAction.editableProperties = [
    { name: 'id', friendly: 'ID', type: 'string' },
    { name: 'delay', friendly: 'Delay', type: 'float' },
    { name: 'gotoId', friendly: 'Go-to ID', type: 'string' }
];

classes['TalkAction'] = TalkAction;

TalkAction.prototype.act = function () {
    if (this.gotoId) {
        for (var i = 0; i < this.behavior.actions.length; i++) {
            var action = this.behavior.actions[i];

            if (action.id == this.gotoId) {
                this.behavior.currentAction = i;
                break;
            }
        }
    }
    else {
        this.behavior.currentAction++;
    }
};

TalkAction.prototype.serialize = function () {
    var r = {
        _type: this.constructor.name,
        id: this.id,
        delay: this.delay,
        gotoId: this.gotoId
    };

    return r;
};

TalkAction.deserialize = function (data, behavior, talkAction) {
    if (!talkAction || talkAction.constructor.name != data._type)
        talkAction = createFromName(data._type, {});

    talkAction.id = data.id;
    talkAction.delay = data.delay;
    talkAction.gotoId = data.gotoId;
    talkAction.behavior = behavior;

    return talkAction;
};