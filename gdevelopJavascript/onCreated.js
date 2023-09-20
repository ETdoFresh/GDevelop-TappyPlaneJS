const behaviorName = eventsFunctionContext._behaviorNamesMap.Behavior;

// If External Code is already loaded
gdjs.externalCode = gdjs.externalCode || {};
if (gdjs.externalCode[behaviorName]) {
    gdjs.externalCode[behaviorName].onCreated(runtimeScene, eventsFunctionContext);
    return;
}

// Otherwise, Load External Code
const behaviorType = runtimeScene.getInitialSharedDataForBehavior(behaviorName).type;
const extensionName = behaviorType.split("::")[0];
const sharedDataKey = `_${extensionName}_${behaviorName}SharedData`;
const urlsCombined = runtimeScene[sharedDataKey].ExternalUrls;
const urls = urlsCombined.split(",").map(url => `${url}/${behaviorName}.js`);

let caughtErrorCount = 0;

// Load external code
urls.forEach(url => {
    import(url).then((module) => { 
        if (gdjs.externalCode[behaviorName]) return;
        gdjs.externalCode[behaviorName] = module[behaviorName];
        gdjs.externalCode[behaviorName].onCreated(runtimeScene, eventsFunctionContext);
    })
    .catch(error => {
        caughtErrorCount++;
        if (caughtErrorCount === urls.length) {
            console.error(`Failed to load external code for behavior ${behaviorName} from urls ${urls} with error ${error}`);
        }
    });
});