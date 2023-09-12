export function processEvents(runtimeScene, isFirstRun) {
    onSceneLoad(runtimeScene, isFirstRun);
    onClickDuringInstructions(runtimeScene);
    onMoving(runtimeScene);
    onGamePlaying(runtimeScene);
    
    onRefreshClick(runtimeScene);
}

function onSceneLoad(runtimeScene, isFirstRun) {
    const isSceneLoadedEvent = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene) || isFirstRun;
    if (!isSceneLoadedEvent) return;

    window.runtimeScene = runtimeScene;

    runtimeScene.getVariables().add("State", (new gdjs.Variable()).fromJSObject("NotStarted"))

    runtimeScene._instances.items.TappyPlane.forEach(tappyPlane => { tappyPlane.getBehavior("PlatformerObject").activate(false); })

    runtimeScene._instances.items.HighScoreChanged.forEach(hsc => hsc.hide());

    gdjs.evtTools.camera.showLayer(runtimeScene, "Transition");
    gdjs.evtTools.camera.hideLayer(runtimeScene, "GameOver");

    // Create objects from external layout "GameOver"
    // Create objects from external layour "SubmitScore"

    runtimeScene._instances.items.CurrentScore.forEach(currentScore => { currentScore.setOutline("0;0;0", 2); });

    runtimeScene._instances.items.BlackRect.forEach(blackRect => {
        blackRect.getBehavior("Tween").addObjectOpacityTween("FadeIn", 0, "linear", 250, false);
    })
}

function onClickDuringInstructions(runtimeScene) {
    const stateVariable = runtimeScene.getVariables().get("State");
    if (stateVariable.getValue() != "NotStarted") return;

    const isLeftMouseButtonReleased = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
    const isSpaceKeyReleased = gdjs.evtTools.input.wasKeyReleased(runtimeScene, "Space");
    if (!isLeftMouseButtonReleased && !isSpaceKeyReleased) return;

    stateVariable.setValue("GamePlaying");

    runtimeScene._instances.items.TappyPlane.forEach(tappyPlane => {
        tappyPlane.getBehavior("EllipseMovement").activate(false);
        tappyPlane.getBehavior("PlatformerObject").activate(true);
    });

    runtimeScene._instances.items.Instructions.forEach(instructions => {
        instructions.hide();
    });
}

function onMoving(runtimeScene) {
    const stateVariable = runtimeScene.getVariables().get("State");
    if (stateVariable.getValue() != "GamePlaying") return;

    const delta = gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene);
    runtimeScene._instances.items.Ground.forEach(ground => {
        ground.setXOffset(ground.getXOffset() + 100 * delta);
    });

    runtimeScene._instances.items.Ceiling.forEach(ceiling => {
        ceiling.setXOffset(ceiling.getXOffset() - 100 * delta);
    });
}

function onGamePlaying(runtimeScene) {
    const stateVariable = runtimeScene.getVariables().get("State");
    if (stateVariable.getValue() != "GamePlaying") return;

    const delta = gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene);

    // Plane

    // Rotate plane downward when falling
    runtimeScene._instances.items.TappyPlane.forEach(tappyPlane => {
        const isFalling = tappyPlane.getBehavior("PlatformerObject").isFalling();
        if (!isFalling) return;
        tappyPlane.rotateTowardAngle(90, 150);
    });

    // Jump to move up
    const isLeftMouseButtonReleased = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
    const isSpaceKeyReleased = gdjs.evtTools.input.wasKeyReleased(runtimeScene, "Space");
    runtimeScene._instances.items.TappyPlane.forEach(tappyPlane => {
        if (!isLeftMouseButtonReleased && !isSpaceKeyReleased) return;

        gdjs.evtTools.sound.playSound(runtimeScene, "assets\\sfx_wing.wav", false, 70, 1);
        tappyPlane.getBehavior("PlatformerObject").simulateJumpKey();
        tappyPlane.getBehavior("PlatformerObject").setCanJump();
        tappyPlane.angle = 320;
    });

    // Pipe spawn
    // coming soon

    // Create pillars with a hole at a random vertical position
    // coming soon

    // Obstacle

    // Player loses when the plane crashes
    const obstacles = runtimeScene.getObjects("BottomPillar")
        .concat(runtimeScene.getObjects("TopPillar"))
        .concat(runtimeScene.getObjects("Ground"))
        .concat(runtimeScene.getObjects("Ceiling"));
    const tappyPlanes = runtimeScene.getObjects("TappyPlane");
    let isCrashed = false;
    tappyPlanes.forEach(tappyPlane => {
        obstacles.forEach(obstacle => {
            if (isCrashed) return;
            isCrashed = gdjs.RuntimeObject.collisionTest(tappyPlane, obstacle, false);
        });
    });

    if (isCrashed) {
        const stateVariable = runtimeScene.getVariables().get("State");
        stateVariable.setValue("GameOver");
        gdjs.evtTools.sound.playSound(runtimeScene, "assets\\sfx_hit.wav", false, 100, 0.8);
    }
}

function onRefreshClick(runtimeScene) {
    let isClicked = false;
    runtimeScene._instances.items.Refresh.forEach(refresh => {
        if (isClicked) return;
        isClicked = refresh.IsClicked(runtimeScene);
    });
    if (!isClicked) return;
    location.reload();
}