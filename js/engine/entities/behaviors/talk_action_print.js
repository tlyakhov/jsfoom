function TalkActionPrint(options) {
    TalkAction.call(this, options);

    this.gameText = { text: 'Default Text', fillStyle: '#8F8' };

    $.extend(true, this, options);
}

TalkActionPrint.editableProperties = {};

classes['TalkActionPrint'] = TalkActionPrint;

TalkActionPrint.prototype.act = function () {
    globalGame.gameTextQueue.push($.extend(true, {}, this.gameText)); // Clone it, must be unique.
};

TalkActionPrint.prototype.serialize = function () {
    var r = TalkAction.prototype.serialize.call(this);

    r.gameText = this.gameText;

    return r;
};

TalkActionPrint.deserialize = function (data, behavior, action) {
    action = TalkAction.deserialize(data, behavior, action);

    action.gameText = data.gameText;

    return action;
};