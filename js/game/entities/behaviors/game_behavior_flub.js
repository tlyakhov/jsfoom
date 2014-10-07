inherit(Behavior, GameBehaviorFlub);

function GameBehaviorFlub(options) {
    Behavior.call(this, options);

    $.extend(true, this, options);
}

GameBehaviorFlub.editableProperties = Behavior.editableProperties.concat([]);

classes['GameBehaviorFlub'] = GameBehaviorFlub;

GameBehaviorFlub.prototype.frame = function (lastFrameTime) {
    Behavior.prototype.frame.call(this, lastFrameTime);

    if (!this.entity)
        return;

    var behaviors = this.entity.behaviors;

    if (behaviors.length == 1) {
        behaviors.push(new WanderBehavior({ speed: 0.1, facing: true, moveZ: false, entity: this.entity }));

        behaviors.push(new TalkBehavior({
            onlyOnce: true,
            entity: this.entity,
            actions: [
                new TalkActionQuestion({
                    id: 'question',
                    gameText: { text: 'Do you even?', fillStyle: '#00F' },
                    options: [
                        { text: 'Yes', gotoId: 'question' },
                        { text: 'No' }
                    ]
                }),
                new TalkActionPrint({
                    gameText: { text: 'Woo!', fillStyle: '#F00' }
                })
            ]
        }));
    }
};

GameBehaviorFlub.prototype.serialize = function () {
    var r = Behavior.prototype.serialize.call(this);

    return r;
};

GameBehaviorFlub.deserialize = function (data, entity, behavior) {
    behavior = Behavior.deserialize(data, entity, behavior);

    return behavior;
};