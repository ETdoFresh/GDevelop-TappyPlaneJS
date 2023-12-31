export class GDevelopBehavior {
    static objects = [];
    static behaviors = [];
    static behaviorScripts = [];

    static onCreated(runtimeScene, eventsFunctionContext) {
        const objects = eventsFunctionContext._objectArraysMap.Object;
        const behaviorName = eventsFunctionContext._behaviorNamesMap.Behavior;
        objects.forEach(object => {
            const behavior = object.getBehavior(behaviorName);
            if (this.objects.includes(object) && this.behaviors.includes(behavior)) return;
            const behaviorScript = new this(object, behavior);
            this.objects.push(object);
            this.behaviors.push(behavior);
            this.behaviorScripts.push(behaviorScript);
            behaviorScript.runtimeScene = runtimeScene;
            behaviorScript.eventFunctionContext = eventsFunctionContext;
            if (behaviorScript.onCreated)
                behaviorScript.onCreated();
        });
    }

    static onActivate(runtimeScene, eventsFunctionContext) {
        const objects = eventsFunctionContext._objectArraysMap.Object;
        const behaviorName = eventsFunctionContext._behaviorNamesMap.Behavior;
        objects.forEach(object => {
            const behavior = object.getBehavior(behaviorName);
            const index = this.behaviors.indexOf(behavior);
            if (index === -1) return;
            const behaviorScript = this.behaviorScripts[index];
            behaviorScript.runtimeScene = runtimeScene;
            behaviorScript.eventFunctionContext = eventsFunctionContext;
            if (behaviorScript.onActivate)
                behaviorScript.onActivate();
        });
    }

    static onDeActivate(runtimeScene, eventsFunctionContext) {
        const objects = eventsFunctionContext._objectArraysMap.Object;
        const behaviorName = eventsFunctionContext._behaviorNamesMap.Behavior;
        objects.forEach(object => {
            const behavior = object.getBehavior(behaviorName);
            const index = this.behaviors.indexOf(behavior);
            if (index === -1) return;
            const behaviorScript = this.behaviorScripts[index];
            behaviorScript.runtimeScene = runtimeScene;
            behaviorScript.eventFunctionContext = eventsFunctionContext;
            if (behaviorScript.onDeActivate)
                behaviorScript.onDeActivate();
        });
    }

    static doStepPreEvents(runtimeScene, eventsFunctionContext) {
        const delta = gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene);
        const objects = eventsFunctionContext._objectArraysMap.Object;
        const behaviorName = eventsFunctionContext._behaviorNamesMap.Behavior;
        objects.forEach(object => {
            const behavior = object.getBehavior(behaviorName);
            const index = this.behaviors.indexOf(behavior);
            if (index === -1) return;
            const behaviorScript = this.behaviorScripts[index];
            behaviorScript.runtimeScene = runtimeScene;
            behaviorScript.eventFunctionContext = eventsFunctionContext;
            if (behaviorScript.doStepPreEvents)
                behaviorScript.doStepPreEvents(delta);
        });
    }

    static doStepPostEvents(runtimeScene, eventsFunctionContext) {
        const delta = gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene);
        const objects = eventsFunctionContext._objectArraysMap.Object;
        const behaviorName = eventsFunctionContext._behaviorNamesMap.Behavior;
        objects.forEach(object => {
            const behavior = object.getBehavior(behaviorName);
            const index = this.behaviors.indexOf(behavior);
            if (index === -1) return;
            const behaviorScript = this.behaviorScripts[index];
            behaviorScript.runtimeScene = runtimeScene;
            behaviorScript.eventFunctionContext = eventsFunctionContext;
            if (behaviorScript.doStepPostEvents)
                behaviorScript.doStepPostEvents(delta);
        });
    }

    static onDestroy(runtimeScene, eventsFunctionContext) {
        const objects = eventsFunctionContext._objectArraysMap.Object;
        const behaviorName = eventsFunctionContext._behaviorNamesMap.Behavior;
        objects.forEach(object => {
            const behavior = object.getBehavior(behaviorName);
            const index = this.behaviors.indexOf(behavior);
            if (index === -1) return;
            const behaviorScript = this.behaviorScripts[index];
            this.objects.splice(index, 1);
            this.behaviors.splice(index, 1);
            this.behaviorScripts.splice(index, 1);
            behaviorScript.runtimeScene = runtimeScene;
            behaviorScript.eventFunctionContext = eventsFunctionContext;
            if (behaviorScript.onDestroy)
                behaviorScript.onDestroy();
        });
    }

    static exec(runtimeScene, eventsFunctionContext, func) {
        let value = null;
        const objects = eventsFunctionContext._objectArraysMap.Object;
        const behaviorName = eventsFunctionContext._behaviorNamesMap.Behavior;
        objects.forEach(object => {
            if (value !== null) return;
            const behavior = object.getBehavior(behaviorName);
            const index = this.behaviors.indexOf(behavior);
            if (index === -1) return;
            const behaviorScript = this.behaviorScripts[index];
            behaviorScript.runtimeScene = runtimeScene;
            behaviorScript.eventFunctionContext = eventsFunctionContext;
            if (behaviorScript[func])
                value = behaviorScript[func]();
        });
        return value;
    }

    // --------------------------------------------------

    get ObjectX() { return this._object.getX(); }
    set ObjectX(value) { this._object.setX(value); }
    get ObjectY() { return this._object.getY(); }
    set ObjectY(value) { this._object.setY(value); }
    get ObjectAngle() { return this._object.getAngle(); }
    set ObjectAngle(value) { this._object.setAngle(value); }

    constructor(object, behavior) {
        this._object = object;
        this._behavior = behavior;
        this._behaviorData = behavior._behaviorData;
    }
}