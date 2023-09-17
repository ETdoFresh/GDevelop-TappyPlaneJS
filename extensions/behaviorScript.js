export class behaviorScript {
    static objects = [];
    static behaviors = [];
    static behaviorScripts = [];

    constructor(object, behavior) {
        this.object = object;
        this.behavior = behavior;
        this.behaviorData = behavior._behaviorData;
    }

    static onCreated(runtimeScene, eventsFunctionContext) {
        const objects = eventsFunctionContext._objectArraysMap.Object;
        objects.forEach(object => {
            if (this.objects.includes(object)) return;
            const behaviorName = eventsFunctionContext._behaviorNamesMap.Behavior;
            const behavior = object.getBehavior(behaviorName);
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
        objects.forEach(object => {
            const index = this.objects.indexOf(object);
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
        objects.forEach(object => {
            const index = this.objects.indexOf(object);
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
        objects.forEach(object => {
            const index = this.objects.indexOf(object);
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
        objects.forEach(object => {
            const index = this.objects.indexOf(object);
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
        objects.forEach(object => {
            const index = this.objects.indexOf(object);
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

    static runCustomFunction(runtimeScene, eventsFunctionContext, functionName) {
        let value = null;
        const objects = eventsFunctionContext._objectArraysMap.Object;
        objects.forEach(object => {
            if (value !== null) return;
            const index = this.objects.indexOf(object);
            if (index === -1) return;
            const behaviorScript = this.behaviorScripts[index];
            behaviorScript.runtimeScene = runtimeScene;
            behaviorScript.eventFunctionContext = eventsFunctionContext;
            if (behaviorScript[functionName])
                value = behaviorScript[functionName]();
        });
        return value;
    }
}