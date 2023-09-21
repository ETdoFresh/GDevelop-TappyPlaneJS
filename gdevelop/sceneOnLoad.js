const urlFolder = "scenes";
const sceneName = runtimeScene.getName();

// If External Code is already loaded, call onCreated
gdjs.externalSceneCode = gdjs.externalSceneCode || {};
if (gdjs.externalSceneCode[sceneName]) {
    gdjs.externalSceneCode[sceneName].onSceneLoaded(runtimeScene, eventsFunctionContext);
    return;
}

// Otherwise, Load External Code, then call onCreated
const urlsCombined = gdjs.evtsExt__ExternalCode__getUrls.func();
const urls = urlsCombined.split(",").map(url => `${url}/${urlFolder}/${sceneName}.js`);

let caughtErrorCount = 0;
urls.forEach(url => {
    import(url).then((module) => { 
        if (gdjs.externalSceneCode[sceneName]) return;
        gdjs.externalSceneCode[sceneName] = module[sceneName];
        gdjs.externalSceneCode[sceneName].onSceneLoaded(runtimeScene, eventsFunctionContext);
    })
    .catch(error => {
        caughtErrorCount++;
        if (caughtErrorCount === urls.length) {
            console.debug(`[OnSceneLoaded] Skipping external code for scene ${sceneName} from urls ${urls} with error ${error}`);
        }
    });
});