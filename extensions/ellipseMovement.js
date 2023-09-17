import { behaviorScript } from "./behaviorScript.js";

export class ellipseMovement extends behaviorScript {

    onCreated() {
        this.$bd.OldX = this.$o.getX();
        this.$bd.OldY = this.$o.getY();

        // Evaluate the center of movement from the object position and properties.
        if (this.$bd.InitialTurningLeft === true)
            this.$bd.LoopDuration = this.$bd.LoopDuration * -1;

        if (this.$bd.LoopDuration < 0)
            this.$bd.MovementAngle = this.$bd.InitialDirectionAngle + 90;

        if (this.$bd.LoopDuration > 0)
            this.$bd.MovementAngle = this.$bd.InitialDirectionAngle - 90;

        this.$bd.CenterX = this.$o.getX() - this.deltaX();
        this.$bd.CenterY = this.$o.getY() - this.deltaY();
    }

    onDestroy() { 
    }

    onActivate() { 
    }

    onDeActivate() { 
    }

    doStepPreEvents(delta) {
        // Update the center when the object is moved outside of the behavior.
        this.$bd.CenterX = this.$bd.CenterX + (this.$o.getX() - this.$bd.OldX);
        this.$bd.CenterY = this.$bd.CenterY + (this.$o.getY() - this.$bd.OldY);

        // Place the object according to the movement angle.
        if (this.$bd.RadiusX !== 0)
            this.$o.setX(this.$bd.CenterX + this.deltaX());

        if (this.$bd.RadiusY !== 0) {
            this.$o.setY(this.$bd.CenterY + this.deltaY());
        }

        if (this.$bd.ShouldRotate === true)
            this.$o.setAngle(directionAngle());

        // Save the position to detect when the object is moved outside of the behavior.
        this.$bd.OldX = this.$o.getX();
        this.$bd.OldY = this.$o.getY();
    }

    doStepPostEvents(delta) {
        // Update the movement angle for the next frame.
        this.$bd.MovementAngle = this.$bd.MovementAngle + 360 * delta / this.$bd.LoopDuration;
    }

    toggleTurningLeft() {
        this.$bd.CenterX = 2 * this.$o.getX() - CenterX();
        this.$bd.CenterY = 2 * this.$o.getY() - CenterY();

        this.$bd.MovementAngle = this.$bd.MovementAngle + 180;

        this.$bd.LoopDuration = this.$bd.LoopDuration * -1;
    }

    setTurningLeft() {
        const value = eventsFunctionContext.getArgument("Value");
        if (this.isTurningLeft() === true && !value)
            this.toggleTurningLeft();
        else if (this.isTurningLeft() === false && value)
            this.toggleTurningLeft();
    }

    isTurningLeft() {
        return this.$bd.LoopDuration < 0;
    }

    movementAngle() {
        return this.$bd.MovementAngle;
    }

    loopDuration() {
        return this.$bd.LoopDuration;;
    }

    radiusX() {
        return this.$bd.RadiusX;
    }

    radiusY() {
        return this.$bd.RadiusY;
    }

    CenterX() {
        return this.$bd.CenterX;
    }

    CenterY() {
        return this.$bd.CenterY;
    }

    setRadiusX() {
        this.$bd.RadiusX = eventsFunctionContext.getArgument("Value");
    }

    setRadiusY() {
        this.$bd.RadiusY = eventsFunctionContext.getArgument("Value");
    }

    setLoopDuration() {
        this.$bd.LoopDuration = eventsFunctionContext.getArgument("Value");
    }

    setMovementAngle() {
        this.$bd.MovementAngle = eventsFunctionContext.getArgument("Value");
    }

    deltaX() {
        const angle = this.$bd.MovementAngle;
        const radiusX = this.$bd.RadiusX;
        return Math.cos(angle * Math.PI / 180) * radiusX;
    }

    deltaY() {
        const angle = this.$bd.MovementAngle;
        const radiusY = this.$bd.RadiusY;
        return Math.sin(angle * Math.PI / 180) * radiusY;
    }

    directionAngle() {
        const angle = this.$bd.MovementAngle;
        const loopDuration = this.$bd.LoopDuration;
        return angle + 90 * loopDuration / Math.abs(loopDuration);
    }
}