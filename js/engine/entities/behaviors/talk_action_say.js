inherit(TalkAction, TalkActionSay);

function TalkActionSay(options) {
    TalkAction.call(this, options);

    this.gameText = { text: 'Question?', fillStyle: '#8F8' };
    this.options = [];

    $.extend(true, this, options);

    if(this.options && this.options.length > 0)
        this.delay = 0;
}

TalkActionSay.create = function(text, fillStyle, delay, options, id, gotoId) {
    var tas = new TalkActionSay();
    if(text)
        tas.gameText.text = text;
    if(fillStyle)
        tas.gameText.fillStyle = fillStyle;
    if(delay)
        tas.delay = delay;
    if(options)
        tas.options = options;
    if(id)
        tas.id = id;
    if(gotoId)
        tas.gotoId = gotoId;

    return tas;
};

TalkActionSay.editableProperties = TalkAction.editableProperties.concat([
    { name: 'gameText', friendly: 'Game Text', type: 'gameText' },
    { name: 'options', friendly: 'Options', type: 'array' }
]);

classes['TalkActionSay'] = TalkActionSay;

TalkActionSay.prototype.act = function () {
    globalGame.gameTextQueue.push($.extend(true, {}, this.gameText, { question: this })); // Clone it, must be unique.
    if(this.options && this.options.length > 0) {
        globalGame.state = 'question';
        globalGame.talkActionQuestion = this;
        globalGame.talkActionAnswerCallback = $.proxy(this.answer, this);
    }
    else
        this.answer(this.gameText);
};

TalkActionSay.prototype.answer = function (option) {
    if(globalGame.state == 'question')
        globalGame.state = 'game';
    if (option.gotoId) {
        for (var i = 0; i < this.behavior.actions.length; i++) {
            var action = this.behavior.actions[i];

            if (action.id == option.gotoId) {
                this.behavior.currentAction = i;
                break;
            }
        }
    }
    else {
        TalkAction.prototype.act.call(this);
    }
};

TalkActionSay.prototype.serialize = function () {
    var r = TalkAction.prototype.serialize.call(this);

    r.gameText = this.gameText;
    r.options = this.options;

    return r;
};

TalkActionSay.deserialize = function (data, behavior, action) {
    action = TalkAction.deserialize(data, behavior, action);

    action.gameText = data.gameText;
    action.options = data.options;

    return action;
};