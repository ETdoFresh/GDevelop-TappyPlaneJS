import { behaviorScript } from "./behaviorScript.js";


export class characterState extends behaviorScript {
    onCreated() {
        this.behaviorData.CurrentState = "Idle";
        this.behaviorData.PreviousState = "Idle";
        this.behaviorData.CurrentDirection = "S";
        this.behaviorData.PreviousDirection = "S";
    }
    
    doStepPreEvents(delta) {
        this.hasStateBeenChanged = this.behaviorData.CurrentState !== this.behaviorData.PreviousState;
        this.behaviorData.PreviousState = this.behaviorData.CurrentState;

        this.hasDirectionBeenChanged = this.behaviorData.CurrentDirection !== this.behaviorData.PreviousDirection;
        this.behaviorData.PreviousDirection = this.behaviorData.CurrentDirection;
    }

    isNewCharacterState() {
        return this.hasStateBeenChanged;
    }

    isNewCharacterDirection() {
        return this.hasDirectionBeenChanged;
    }

    getState() {
        return this.behaviorData.CurrentState;
    }

    getDirection() {
        return this.behaviorData.CurrentDirection;
    }
}