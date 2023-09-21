export class GDevelopScene {
    static scenes = [];

    static onSceneLoaded(runtimeScene, eventsFunctionContext) { 
        console.log("[GDevelopScene]", runtimeScene, eventsFunctionContext);
    }

    static onScenePreEvents(runtimeScene, eventsFunctionContext) { }

    static onScenePostEvents(runtimeScene, eventsFunctionContext) { }

    static onScenePaused(runtimeScene, eventsFunctionContext) { }

    static onSceneResumed(runtimeScene, eventsFunctionContext) { }

    static onSceneUnloading(runtimeScene, eventsFunctionContext) { }
}