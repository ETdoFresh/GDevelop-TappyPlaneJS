export function processEvents(runtimeScene) {
    if (isOnSceneLoad(runtimeScene)) onSceneLoad(runtimeScene);
    if (isOnUpdate(runtimeScene)) onUpdate(runtimeScene);
    if (isOnAuthorLinkClicked(runtimeScene)) onAuthorLinkClicked(runtimeScene);
    if (isOnAuthorLinkHovered(runtimeScene)) onAuthorLinkHovered(runtimeScene);
    if (isOnStartButtonClicked(runtimeScene)) onStartButtonClicked(runtimeScene);
    if (isOnBlackRectangleTweenFinished(runtimeScene)) onBlackRectangleTweenFinished(runtimeScene);
}

function isOnSceneLoad(runtimeScene) {
    return gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
}

function onSceneLoad(runtimeScene) {
    // DEBUG: Access runtimeScene from browser console
    window.runtimeScene = runtimeScene;

    // ACTION: Set BlackRectangle Opactity to 0
    const blackRectangles = runtimeScene._instances.items.BlackRectangle;
    blackRectangles.forEach(blackRectangle => { blackRectangle.setOpacity(0) });

    // ACTION: Show Transition Layer
    gdjs.evtTools.camera.showLayer(runtimeScene, "Transition");
}

function isOnUpdate(runtimeScene) {
    return true;
}

function onUpdate(runtimeScene) {
    // ACTION: Move Ground
    const grounds = runtimeScene._instances.items.Ground;
    const delta = gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene);
    grounds.forEach(ground => { ground.setXOffset(ground.getXOffset() + 100 * delta) });
}

function isOnAuthorLinkClicked(runtimeScene) {
    const isLeftReleased = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
    if (!isLeftReleased) return false;

    const authorLinks = runtimeScene._instances.items.AuthorLink;
    authorLinks.forEach(authorLink => {
        if (authorLink.cursorOnObject(runtimeScene)) return true;
    });
    return false;
}

function onAuthorLinkClicked(runtimeScene) {
    window.open("https://github.com/ETdoFresh?tab=repositories", "_blank");
}

function isOnAuthorLinkHovered(runtimeScene) {
    return true;
}

function onAuthorLinkHovered(runtimeScene) {
    const authorLinks = runtimeScene._instances.items.AuthorLink;
    authorLinks.forEach(authorLink => {
        if (authorLink.cursorOnObject(runtimeScene))
            authorLink.setOutline("0;0;255", 3);
        else
            authorLink.setOutline("0;0;255", 0);
    });
}

function isOnStartButtonClicked(runtimeScene) {
    const startButtons = runtimeScene._instances.items.Start; 
    startButtons.forEach(startButton => {
        if (startButton.IsClicked()) {
            return true;
        }
    });
    return false;
}

function onStartButtonClicked(runtimeScene) {
    const sound = "assets\\sfx_swooshing.wav";
    const channel = 1;
    const loop = false;
    const volume = 80;
    const pitch = 1;
    gdjs.evtTools.sound.playSoundOnChannel(runtimeScene, sound, channel, loop, volume, pitch);
    
    const blackRectangles = runtimeScene._instances.items.BlackRectangle;
    blackRectangles.forEach(blackRectangle => {
        const identifier = "FadeOut";
        const toOpacity = 255;
        const easingValue = "easeInQuad";
        const durationValue = 1 * 1000;
        const destroyObjectWhenFinished = false;
        const tween = blackRectangle.getBehavior("Tween");
        tween.addObjectOpacityTween(identifier, toOpacity, easingValue, durationValue, destroyObjectWhenFinished);
    });
}

function isOnBlackRectangleTweenFinished(runtimeScene) {
    const blackRectangles = runtimeScene._instances.items.BlackRectangle;
    blackRectangles.forEach(blackRectangle => {
        if (blackRectangle.getBehavior("Tween").hasFinished("FadeOut")) return true;
    });
    return false;
}

function onBlackRectangleTweenFinished(runtimeScene) {
    gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Game");
}