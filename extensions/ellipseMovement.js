export function onCreated(runtimeScene, eventsFunctionContext) {
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {
        behavior._setOldX(object.getX());
        behavior._setOldY(object.getY());

        // Evaluate the center of movement from the object position and properties.
        if (behavior._getInitialTurningLeft() === true)
            behavior._setLoopDuration(behavior._getLoopDuration() * -1);

        if (behavior._getLoopDuration() < 0)
            behavior._setMovementAngle(behavior._getInitialDirectionAngle() + 90);

        if (behavior._getLoopDuration() > 0)
            behavior._setMovementAngle(behavior._getInitialDirectionAngle() - 90);

        behavior._setCenterX(object.getX() - deltaX(...arguments));
        behavior._setCenterY(object.getY() - deltaY(...arguments));
    });
}

export function doStepPreEvents(runtimeScene, eventsFunctionContext) {
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {

        // Update the center when the object is moved outside of the behavior.
        behavior._setCenterX(behavior._getCenterX() + (object.getX() - behavior._getOldX()));
        behavior._setCenterY(behavior._getCenterY() + (object.getY() - behavior._getOldY()));

        // Place the object according to the movement angle.
        if (behavior._getRadiusX() !== 0)
            object.setX(behavior._getCenterX() + deltaX(...arguments));

        if (behavior._getRadiusY() !== 0)
            object.setY(behavior._getCenterY() + deltaY(...arguments));

        if (behavior._getShouldRotate() === true)
            object.setAngle(directionAngle(...arguments));

        // Save the position to detect when the object is moved outside of the behavior.
        behavior._setOldX(object.getX());
        behavior._setOldY(object.getY());
    });
}

export function doStepPostEvents(runtimeScene, eventsFunctionContext) {
    const delta = gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene);
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {
        
        // Update the movement angle for the next frame.
        behavior._setMovementAngle(behavior._getMovementAngle() + 360 * delta / behavior._getLoopDuration());
    });
}

export function toggleTurningLeft(runtimeScene, eventsFunctionContext) {
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {

        behavior._setCenterX(2 * object.getX() - CenterX(...arguments));
        behavior._setCenterY(2 * object.getY() - CenterY(...arguments));

        behavior._setMovementAngle(behavior._getMovementAngle() + 180);

        behavior._setLoopDuration(behavior._getLoopDuration() * -1);
    });
}

export function setTurningLeft(runtimeScene, eventsFunctionContext) {
    const value = eventsFunctionContext.getArgument("Value");
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {
        if (isTurningLeft(...arguments) === true && !value)
            toggleTurningLeft(...arguments);
        else if (isTurningLeft(...arguments) === false && value)
            toggleTurningLeft(...arguments);
    });
}

export function isTurningLeft(runtimeScene, eventsFunctionContext) {
    let value = null;
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {
        if (value !== null) return;
        value = behavior._getLoopDuration() < 0;
    });
    return value;
}

export function movementAngle(runtimeScene, eventsFunctionContext) {
    let value = null;
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {
        if (value !== null) return;
        value = behavior._getMovementAngle();
    });
    return value;
}

export function loopDuration(runtimeScene, eventsFunctionContext) {
    let value = null;
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {
        if (value !== null) return;
        value = behavior._getLoopDuration();
    });
    return value;
}

export function radiusX(runtimeScene, eventsFunctionContext) {
    let value = null;
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {
        if (value !== null) return;
        value = behavior._getRadiusX();
    });
    return value;
}

export function radiusY(runtimeScene, eventsFunctionContext) {
    let value = null;
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {
        if (value !== null) return;
        value = behavior._getRadiusY();
    });
    return value;
}

export function centerX(runtimeScene, eventsFunctionContext) {
    let value = null;
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {
        if (value !== null) return;
        value = behavior._getCenterX();
    });
    return value;
}

export function centerY(runtimeScene, eventsFunctionContext) {
    let value = null;
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {
        if (value !== null) return;
        value = behavior._getCenterY();
    });
    return value;
}

export function setRadiusX(runtimeScene, eventsFunctionContext) {
    const value = eventsFunctionContext.getArgument("Value");
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {
        behavior._setRadiusX(value);
    });
}

export function setRadiusY(runtimeScene, eventsFunctionContext) {
    const value = eventsFunctionContext.getArgument("Value");
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {
        behavior._setRadiusY(value);
    });
}

export function setLoopDuration(runtimeScene, eventsFunctionContext) {
    const value = eventsFunctionContext.getArgument("Value");
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {
        if (isTurningLeft(...arguments) === true)
            behavior._setLoopDuration(-1 * value);
        else
            behavior._setLoopDuration(value);
    });
}

export function setMovementAngle(runtimeScene, eventsFunctionContext) {
    const value = eventsFunctionContext.getArgument("Value");
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {
        behavior._setMovementAngle(value);
    });
}

export function deltaX(runtimeScene, eventsFunctionContext) {
    let value = null;
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {
        if (value !== null) return;
        const angle = behavior._getMovementAngle();
        const radiusX = behavior._getRadiusX();
        value = Math.cos(angle * Math.PI / 180) * radiusX;
    });
    return value;
}

export function deltaY(runtimeScene, eventsFunctionContext) {
    let value = null;
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {
        if (value !== null) return;
        const angle = behavior._getMovementAngle();
        const radiusY = behavior._getRadiusY();
        value = Math.sin(angle * Math.PI / 180) * radiusY;
    });
    return value;
}

export function directionAngle(runtimeScene, eventsFunctionContext) {
    let value = null;
    getObjectsAndBehaviors(eventsFunctionContext).forEach(({object, behavior}) => {
        if (value !== null) return;
        const angle = behavior._getMovementAngle();
        const loopDuration = behavior._getLoopDuration();

        if (loopDuration < 0)
            value = angle + 90;
        else if (loopDuration >= 0)
            value = angle - 90;
    });
    return value;
}

function getObjects(eventsFunctionContext) {
    return eventsFunctionContext._objectArraysMap.Object;
}

function getBehaviorName(eventsFunctionContext) {
    return eventsFunctionContext._behaviorNamesMap.Behavior;
}

function getBehavior(object, eventsFunctionContext) {
    return object.getBehavior(getBehaviorName(eventsFunctionContext));
}

function getObjectsAndBehaviors(eventsFunctionContext) {
    return getObjects(eventsFunctionContext).map(object => ({ object: object, behavior: getBehavior(object, eventsFunctionContext)}));
}
