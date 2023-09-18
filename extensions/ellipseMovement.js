import { behaviorScript } from "./behaviorScript.js";


export class ellipseMovement extends behaviorScript {

    onCreated() {
        this.behaviorData.OldX = this.object.getX();
        this.behaviorData.OldY = this.object.getY();

        // Evaluate the center of movement from the object position and properties.
        if (this.behaviorData.InitialTurningLeft === true)
            this.behaviorData.LoopDuration = this.behaviorData.LoopDuration * -1;

        if (this.behaviorData.LoopDuration < 0)
            this.behaviorData.MovementAngle = this.behaviorData.InitialDirectionAngle + 90;

        if (this.behaviorData.LoopDuration > 0)
            this.behaviorData.MovementAngle = this.behaviorData.InitialDirectionAngle - 90;

        this.behaviorData.CenterX = this.object.getX() - this.deltaX();
        this.behaviorData.CenterY = this.object.getY() - this.deltaY();
    }

    onDestroy() { 
    }

    onActivate() { 
    }

    onDeActivate() { 
    }

    doStepPreEvents(delta) {
        // Update the center when the object is moved outside of the behavior.
        this.behaviorData.CenterX = this.behaviorData.CenterX + (this.object.getX() - this.behaviorData.OldX);
        this.behaviorData.CenterY = this.behaviorData.CenterY + (this.object.getY() - this.behaviorData.OldY);

        // Place the object according to the movement angle.
        if (this.behaviorData.RadiusX !== 0)
            this.object.setX(this.behaviorData.CenterX + this.deltaX());

        if (this.behaviorData.RadiusY !== 0) {
            this.object.setY(this.behaviorData.CenterY + this.deltaY());
        }

        if (this.behaviorData.ShouldRotate === true)
            this.object.setAngle(directionAngle());

        // Save the position to detect when the object is moved outside of the behavior.
        this.behaviorData.OldX = this.object.getX();
        this.behaviorData.OldY = this.object.getY();
    }

    doStepPostEvents(delta) {
        // Update the movement angle for the next frame.
        this.behaviorData.MovementAngle = this.behaviorData.MovementAngle + 360 * delta / this.behaviorData.LoopDuration;
    }

    toggleTurningLeft() {
        this.behaviorData.CenterX = 2 * this.object.getX() - CenterX();
        this.behaviorData.CenterY = 2 * this.object.getY() - CenterY();

        this.behaviorData.MovementAngle = this.behaviorData.MovementAngle + 180;

        this.behaviorData.LoopDuration = this.behaviorData.LoopDuration * -1;
    }

    setTurningLeft() {
        const value = eventsFunctionContext.getArgument("Value");
        if (this.isTurningLeft() === true && !value)
            this.toggleTurningLeft();
        else if (this.isTurningLeft() === false && value)
            this.toggleTurningLeft();
    }

    isTurningLeft() {
        return this.behaviorData.LoopDuration < 0;
    }

    movementAngle() {
        return this.behaviorData.MovementAngle;
    }

    loopDuration() {
        return this.behaviorData.LoopDuration;;
    }

    radiusX() {
        return this.behaviorData.RadiusX;
    }

    radiusY() {
        return this.behaviorData.RadiusY;
    }

    CenterX() {
        return this.behaviorData.CenterX;
    }

    CenterY() {
        return this.behaviorData.CenterY;
    }

    setRadiusX() {
        this.behaviorData.RadiusX = eventsFunctionContext.getArgument("Value");
    }

    setRadiusY() {
        this.behaviorData.RadiusY = eventsFunctionContext.getArgument("Value");
    }

    setLoopDuration() {
        this.behaviorData.LoopDuration = eventsFunctionContext.getArgument("Value");
    }

    setMovementAngle() {
        this.behaviorData.MovementAngle = eventsFunctionContext.getArgument("Value");
    }

    deltaX() {
        const angle = this.behaviorData.MovementAngle;
        const radiusX = this.behaviorData.RadiusX;
        return Math.cos(angle * Math.PI / 180) * radiusX;
    }

    deltaY() {
        const angle = this.behaviorData.MovementAngle;
        const radiusY = this.behaviorData.RadiusY;
        return Math.sin(angle * Math.PI / 180) * radiusY;
    }

    directionAngle() {
        const angle = this.behaviorData.MovementAngle;
        const loopDuration = this.behaviorData.LoopDuration;
        return angle + 90 * loopDuration / Math.abs(loopDuration);
    }
}