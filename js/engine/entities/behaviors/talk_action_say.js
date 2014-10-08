inherit(TalkAction, TalkActionSay);

function TalkActionSay(options) {
    TalkAction.call(this, options);

    this.gameText = { text: 'Question?', fillStyle: '#8F8' };
    this.options = [];
    this.delay = 0;
    $.extend(true, this, options);
}

TalkActionSay.editableProperties = {};

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
        for (var i = 0; i < this.behavior.actions; i++) {
            var action = this.behavior.actions[i];

            if (action.id == option.gotoId) {
                this.behavior.currentAction = i;
                break;
            }
        }
    }
    else {
        this.behavior.currentAction++;

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