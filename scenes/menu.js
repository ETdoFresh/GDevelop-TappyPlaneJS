export function processEvents(runtimeScene, isFirstRun) {
    onSceneLoad(runtimeScene, isFirstRun);
    onUpdateGround(runtimeScene);
    onAuthorLinkClicked(runtimeScene);
    onAuthorLinkHovered(runtimeScene);
    onStartButtonClicked(runtimeScene);
    onBlackRectangleTweenFinished(runtimeScene);
}

function onSceneLoad(runtimeScene, isFirstRun) {
    const isSceneLoadedEvent = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene) || isFirstRun;
    if (!isSceneLoadedEvent) return;

    // DEBUG: Access runtimeScene from browser console
    window.runtimeScene = runtimeScene;

    // ACTION: Set BlackRectangle Opactity to 0
    const blackRectangles = runtimeScene._instances.items.BlackRectangle;
    blackRectangles.forEach(blackRectangle => { blackRectangle.setOpacity(0) });

    // ACTION: Show Transition Layer
    gdjs.evtTools.camera.showLayer(runtimeScene, "Transition");
}

function onUpdateGround(runtimeScene) {
    // ACTION: Move Ground
    const grounds = runtimeScene._instances.items.Ground;
    const delta = gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene);
    grounds.forEach(ground => { ground.setXOffset(ground.getXOffset() + 100 * delta) });
}

function onAuthorLinkClicked(runtimeScene) {
    const isLeftReleased = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
    if (!isLeftReleased) return;

    const authorLinks = runtimeScene._instances.items.AuthorLink;
    let isClicked = false;
    let url = "";
    authorLinks.forEach(authorLink => {
        if (isClicked) return;
        isClicked = authorLink.cursorOnObject(runtimeScene);
        url = authorLink.getString();
    });
    if (!isClicked) return;

    window.open(url, "_blank");
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

function onStartButtonClicked(runtimeScene) {

    let isClicked = false;
    const startButtons = runtimeScene._instances.items.Start;
    startButtons.forEach(startButton => {
        if (isClicked) return;
        isClicked = startButton.IsClicked(runtimeScene);
    });
    if (!isClicked) return;

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

function onBlackRectangleTweenFinished(runtimeScene) {
    let isTweenFinished = false;
    const blackRectangles = runtimeScene._instances.items.BlackRectangle;
    blackRectangles.forEach(blackRectangle => {
        if (isTweenFinished) return;
        if (blackRectangle.getBehavior("Tween").hasFinished("FadeOut"))
            isTweenFinished = true;
    });
    if (!isTweenFinished) return;

    gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "Game");
}