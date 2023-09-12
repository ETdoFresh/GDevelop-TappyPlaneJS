export function onSceneLoad(runtimeScene, objects) {
    if (!gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene)) return;

    // DEBUG: Access runtimeScene from browser console
    window.runtimeScene = runtimeScene;

    // ACTION: Set BlackRectangle Opactity to 0
    objects.forEach(object => { object.setOpacity(0) });

    // ACTION: Show Transition Layer
    gdjs.evtTools.camera.showLayer(runtimeScene, "Transition")
}