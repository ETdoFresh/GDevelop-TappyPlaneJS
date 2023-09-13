export function processEvents(runtimeScene, isFirstRun) {
    onSceneLoad(runtimeScene, isFirstRun);
    onClickDuringInstructions(runtimeScene);
    onMoving(runtimeScene);
    onGamePlaying(runtimeScene);
    onGameOver(runtimeScene);

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

let isGamePlayingTriggered = false;
let isPlanePassingThroughHole = false;
function onGamePlaying(runtimeScene) {
    const pillars = runtimeScene.getObjects("TopPillar").concat(runtimeScene.getObjects("BottomPillar"));
    pillars.forEach(pillar => { pillar.clearForces(); });

    const stateVariable = runtimeScene.getVariables().get("State");
    const wasGamePlayingTriggered = isGamePlayingTriggered;
    isGamePlayingTriggered = stateVariable.getValue() == "GamePlaying";
    if (!isGamePlayingTriggered) return;

    const isTriggeredOnce = !wasGamePlayingTriggered && isGamePlayingTriggered;

    if (isTriggeredOnce) {
        runtimeScene.getTimeManager().addTimer("pipe_spawn");
    }

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

    // Create pillars with a hole at a random vertical position
    if (runtimeScene.getTimeManager().getTimer("pipe_spawn").getTime() > 2.5 * 1000) {
        runtimeScene.getTimeManager().addTimer("pipe_spawn");
        console.log(runtimeScene.getTimeManager().getTimer("pipe_spawn").getTime());

        let topPillar = runtimeScene.createObject("TopPillar");
        topPillar.setX(450);
        topPillar.setY(gdjs.randomInRange(30, 110));

        let bottomPillar = runtimeScene.createObject("BottomPillar");
        bottomPillar.setX(450);
        bottomPillar.setY(topPillar.getY() + 350);

        topPillar.zOrder = 1;
        bottomPillar.zOrder = 1;
        topPillar.setAnimation(gdjs.random(1));
        bottomPillar.setAnimation(gdjs.random(1));
    }

    // Move pillars horizontally
    pillars.forEach(pillar => {
        pillar.addForce(-100, 0, 1);
    });

    // Scoring

    // Add a point to the player score once the player passes a the hole
    const tappyPlanes = runtimeScene.getObjects("TappyPlane");
    const wasPlanePassingThroughHole = isPlanePassingThroughHole;
    isPlanePassingThroughHole = false;
    pillars.forEach(pillar => {
        tappyPlanes.forEach(tappyPlane => {
            if (isPlanePassingThroughHole) return;
            isPlanePassingThroughHole = pillar.getX() < tappyPlane.getCenterXInScene() && pillar.getX() > tappyPlane.getCenterXInScene() - 60;
        });
    });
    const currentScores = runtimeScene.getObjects("CurrentScore");
    if (!wasPlanePassingThroughHole && isPlanePassingThroughHole) {
        runtimeScene.getVariables().get("Score").add(1);
        currentScores.forEach(currentScore => {
            currentScore.setString(runtimeScene.getVariables().get("Score").getAsString());
        });
        gdjs.evtTools.sound.playSound(runtimeScene, "assets\\sfx_point.wav", false, 100, 1);


        // Make the score stand out for half a second
        currentScores.forEach(currentScore => {
            new Promise((resolve, reject) => {
                currentScore.setOutline("0;0;0", 7);
                setTimeout(() => { resolve() }, 500);
            }).then(() => {
                currentScore.setOutline("0;0;0", 2);
            });
        });
    }

    // Obstacle

    // Player loses when the plane crashes
    const obstacles = runtimeScene.getObjects("BottomPillar")
        .concat(runtimeScene.getObjects("TopPillar"))
        .concat(runtimeScene.getObjects("Ground"))
        .concat(runtimeScene.getObjects("Ceiling"));
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

let isGameOverTriggered = false;
function onGameOver(runtimeScene) {
    const stateVariable = runtimeScene.getVariables().get("State");
    const wasGameOverTriggered = isGameOverTriggered;
    isGameOverTriggered = stateVariable.getValue() == "GameOver";
    if (!isGameOverTriggered) return;

    const isTriggeredOnce = !wasGameOverTriggered && isGameOverTriggered;
    const currentScores = runtimeScene.getObjects("CurrentScore");
    const highScoreChangeds = runtimeScene.getObjects("HighScoreChanged");
    const finalScores = runtimeScene.getObjects("FinalScore");
    const highScores = runtimeScene.getObjects("HighScore");

    if (isTriggeredOnce) {
        var flash = runtimeScene.createObject("Flash");
        flash.setLayer("GUI");
        //flash.getBehavior("Flash").Flash(0.1, runtimeScene);
        new Promise((resolve, reject) => {
            setTimeout(() => { resolve() }, 100);
        }).then(() => {
            flash.deleteFromScene(runtimeScene);
            gdjs.evtTools.camera.showLayer(runtimeScene, "GameOver");
            currentScores.forEach(currentScore => { currentScore.hide(); });
            highScoreChangeds.forEach(highScoreChanged => highScoreChanged.hide());
            finalScores.forEach(finalScore => { 
                finalScore.setString(runtimeScene.getVariables().get("Score").getAsString()); 
                finalScore.setOutline("0;0;0", 2);
            });
            highScores.forEach(highScore => {
                highScore.setOutline("0;0;0", 2);
            });
        });

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