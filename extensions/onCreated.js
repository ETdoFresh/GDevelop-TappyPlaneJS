const externalCodeName = "ellipseMovement";
new Promise((resolve, reject) => {
    const interval = setInterval(() => {
        if (gdjs.externalCode[externalCodeName]) {
            clearInterval(interval);
            gdjs.externalCode[externalCodeName].onCreated(runtimeScene, eventsFunctionContext);
            resolve();
        }
    }, 50);
});