import { GDevelopBehavior } from './GDevelopBehavior.js';

export class EllipseMovement extends GDevelopBehavior {

    get CenterX() { return this._behaviorData.CenterX; }
    set CenterX(value) { this._behaviorData.CenterX = value; }
    get CenterY() { return this._behaviorData.CenterY; }
    set CenterY(value) { this._behaviorData.CenterY = value; }
    get InitialDirectionAngle() { return this._behaviorData.InitialDirectionAngle; }
    set InitialDirectionAngle(value) { this._behaviorData.InitialDirectionAngle = value; }
    get InitialTurningLeft() { return this._behaviorData.InitialTurningLeft; }
    set InitialTurningLeft(value) { this._behaviorData.InitialTurningLeft = value; }
    get LoopDuration() { return this._behaviorData.LoopDuration; }
    set LoopDuration(value) { this._behaviorData.LoopDuration = value; }
    get MovementAngle() { return this._behaviorData.MovementAngle; }
    set MovementAngle(value) { this._behaviorData.MovementAngle = value; }
    get OldX() { return this._behaviorData.OldX; }
    set OldX(value) { this._behaviorData.OldX = value; }
    get OldY() { return this._behaviorData.OldY; }
    set OldY(value) { this._behaviorData.OldY = value; }

    onCreated() {
        this.OldX = this.ObjectX;
        this.OldY = this.ObjectY;

        // Evaluate the center of movement from the object position and properties.
        if (this.InitialTurningLeft === true)
            this.LoopDuration *= -1;

        if (this.LoopDuration < 0)
            this.MovementAngle = this.InitialDirectionAngle + 90;

        if (this.LoopDuration > 0)
            this.MovementAngle = this.InitialDirectionAngle - 90;

        this.CenterX = this.ObjectX - this.deltaX();
        this.CenterY = this.ObjectY - this.deltaY();
    }

    doStepPreEvents(delta) {
        // Update the center when the object is moved outside of the behavior.
        this.CenterX = this.CenterX + (this.ObjectX - this.OldX);
        this.CenterY = this.CenterY + (this.ObjectY - this.OldY);

        // Place the object according to the movement angle.
        if (this.RadiusX !== 0)
            this.ObjectX = this.CenterX + this.deltaX();

        if (this.RadiusY !== 0)
        this.ObjectY = this.CenterY + this.deltaY();

        if (this.ShouldRotate === true)
        this.ObjectAngle = this.directionAngle();

        // Save the position to detect when the object is moved outside of the behavior.
        this.OldX = this.ObjectX;
        this.OldY = this.ObjectY;
    }

    doStepPostEvents(delta) {
        // Update the movement angle for the next frame.
        this.MovementAngle += 360 * delta / this.LoopDuration;
    }

    toggleTurningLeft() {
        this.CenterX = 2 * this.ObjectX - this.CenterX;
        this.CenterY = 2 * this.ObjectY - this.CenterY;
        this.MovementAngle += + 180;
        this.LoopDuration *= -1;
    }

    deltaX() {
        return Math.cos(this.MovementAngle * Math.PI / 180) * this.RadiusX;
    }

    deltaY() {
        return Math.sin(this.MovementAngle * Math.PI / 180) * this.RadiusY;
    }

    directionAngle() {
        return this.MovementAngle + 90 * this.LoopDuration / Math.abs(this.LoopDuration);
    }
}