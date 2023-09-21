const urlFolder = "scenes";
const sceneName = eventsFunctionContext.getArgument("SceneName");

gdjs.externalSceneCode = gdjs.externalSceneCode || {};
if (gdjs.externalSceneCode[sceneName]) {
    return eventsFunctionContext.returnValue = true;
}

this.runOnce = this.runOnce || {};
if (this.runOnce[sceneName]) {
    return eventsFunctionContext.returnValue = false;
}
this.runOnce[sceneName] = true;

const urlsCombined = gdjs.evtsExt__ExternalCode__getUrls.func();
const urls = urlsCombined.split(",").map(url => `${url}/${urlFolder}/${sceneName}.js`);

let caughtErrorCount = 0;
urls.forEach(url => {
    import(url).then((module) => { 
        if (gdjs.externalSceneCode[sceneName]) return;
        gdjs.externalSceneCode[sceneName] = module[sceneName];
        eventsFunctionContext.returnValue = true;

    })
    .catch(error => {
        caughtErrorCount++;
        if (caughtErrorCount === urls.length) {
            console.error(`[scenePreload] Failed to load external code for scene ${sceneName} from urls ${urls} with error ${error}`);
        }
    });
});