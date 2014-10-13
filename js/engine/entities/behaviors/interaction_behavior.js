inherit(Behavior, InteractionBehavior);

function InteractionBehavior(options) {
    Behavior.call(this, options);

    this.entityClasses = [ 'Player' ];
    this.minDistance = GAME_CONSTANTS.interactionDistance;
    this.mustBeFacing = true;
    this.stopMoving = false;
    this.interactingEntity = null;

    $.extend(true, this, options);
}

classes['InteractionBehavior'] = InteractionBehavior;

InteractionBehavior.editorHidden = true;
InteractionBehavior.editableProperties = Behavior.editableProperties.concat([
    { name: 'entityClasses', friendly: 'Entity Classes', type: 'tags' },
    { name: 'minDistance', friendly: 'Minimum Distance', type: 'float' },
    { name: 'mustBeFacing', friendly: 'Must be facing?', type: 'bool' },
    { name: 'stopMoving', friendly: 'Stop Moving?', type: 'bool' }
]);

InteractionBehavior.prototype.startInteracting = function(target) {
    this.interactingEntity = target;

    if(!this.stopMoving)
        return;

    for(var j = 0; j < this.entity.behaviors.length; j++) {
        var behavior = this.entity.behaviors[j];

        if(isA(behavior, WanderBehavior) || isA(behavior, WaypointBehavior)) {
            behavior.active = false;
            this.entity.vel[0] = 0;
            this.entity.vel[1] = 0;
            this.entity.vel[2] = 0;
        }
    }
};

InteractionBehavior.prototype.stopInteracting = function() {
    this.interactingEntity = null;

    if(!this.stopMoving)
        return;

    for(var j = 0; j < this.entity.behaviors.length; j++) {
        var behavior = this.entity.behaviors[j];

        if(isA(behavior, WanderBehavior) || isA(behavior, WaypointBehavior)) {
            behavior.active = true;
        }
    }
};

InteractionBehavior.prototype.frame = function (lastFrameTime) {
    if(!this.active)
        return;

    Behavior.prototype.frame.call(this, lastFrameTime);

    var entity = this.entity;
    
    for(var sid in entity.sector.pvs) {
        var sector = entity.sector.pvs[sid];

        for (var i = 0; i < sector.entities.length; i++) {
            var target = sector.entities[i];

            var valid = false;
            var j = this.entityClasses.length;
            while(j--) {
                if(isA(target, classes[this.entityClasses[j]])) {
                    valid = true;
                    break;
                }
            }

            if(!valid)
                continue;
            if (this.minDistance && vec3dist2(entity.pos, target.pos) > sqr(this.minDistance)) {
                if(this.interactingEntity == target)
                    this.stopInteracting();
                continue;
            }

            if(this.interactingEntity != target) {
                if(this.interactingEntity)
                    this.stopInteracting();
                this.startInteracting(target);
            }

            if(this.mustBeFacing)
            {
                var ang = this.entity.angleTo(target.pos[0], target.pos[1]);
                var diff = normalizeAngle(this.entity.angle - ang);

                if(diff < 5 || diff > 355) {
                    this.entity.angle = ang;
                }
                else if((diff > 0 && diff < 180)) {
                    this.entity.angle -= 5.0;

                    if(this.entity.angle - ang > 5)
                        continue;
                }
                else {
                    this.entity.angle += 5.0;

                    if(ang - this.entity.angle > 5)
                        continue;
                }
            }

            this.interact(lastFrameTime, target);
        }
    }

};

InteractionBehavior.prototype.interact = function (lastFrameTime, target) {

};

InteractionBehavior.prototype.serialize = function () {
    var r = Behavior.prototype.serialize.call(this);

    r.entityClasses = this.entityClasses;
    r.minDistance = this.minDistance;
    r.mustBeFacing = this.mustBeFacing;

    return r;
};

InteractionBehavior.deserialize = function (data, entity, behavior) {
    behavior = Behavior.deserialize(data, entity, behavior);

    behavior.entityClasses = data.entityClasses;
    behavior.minDistance = data.minDistance;
    behavior.mustBeFacing = data.mustBeFacing;

    return behavior;
};