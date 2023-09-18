import { behaviorScript } from "./behaviorScript.js";


export class characterAnimator extends behaviorScript {
    doStepPreEvents(delta) {
        if (!this.state) this.state = this.object.getBehavior("CharacterState");
        if (!this.state) return;
        if (!this.stateData) this.stateData = this.state._behaviorData;
        if (!this.stateData) return;
        if (!this.animator) this.animator = this.object.getBehavior("JSONSpriteSheetAnimator");
        if (!this.animator) return;

        const eventsFunctionContext = this.eventsFunctionContext;
        if (this.state.IsNewCharacterState() || this.state.IsNewCharacterDirection()) {
            const state = this.stateData.CurrentState;
            const direction = this.stateData.CurrentDirection;
            const animationName = `${state}_${direction}`;
            this.animator.PlayAnimation(animationName, this.eventFunctionContext);
        }
    }
}

