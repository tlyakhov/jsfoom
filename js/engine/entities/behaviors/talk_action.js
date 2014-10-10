inherit(EngineObject, TalkAction);

function TalkAction(options) {
    EngineObject.call(this, options);

    this.delay = 1000;
    this.behavior = null;
    this.gotoId = null;

    $.extend(true, this, options);
}

TalkAction.editableProperties = EngineObject.editableProperties.concat([
    { name: 'delay', friendly: 'Delay', type: 'float' },
    { name: 'gotoId', friendly: 'Go-to ID', type: 'string' }
]);

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
    var r = EngineObject.prototype.serialize.call(this);

    r.delay = this.delay;
    r.gotoId = this.gotoId;

    return r;
};

TalkAction.deserialize = function (data, behavior, talkAction) {
    talkAction = EngineObject.deserialize(data, talkAction);

    talkAction.delay = data.delay;
    talkAction.gotoId = data.gotoId;
    talkAction.behavior = behavior;

    return talkAction;
};