const urlFolder = "behaviors";
const behaviorName = eventsFunctionContext._behaviorNamesMap.Behavior;

// If External Code is already loaded, call onCreated
gdjs.externalCode = gdjs.externalCode || {};
if (gdjs.externalCode[behaviorName]) {
    gdjs.externalCode[behaviorName].onCreated(runtimeScene, eventsFunctionContext);
    return;
}

// Otherwise, Load External Code, then call onCreated
const urlsCombined = gdjs.evtsExt__ExternalCode__getUrls.func();
const urls = urlsCombined.split(",").map(url => `${url}/${urlFolder}/${behaviorName}.js`);

let caughtErrorCount = 0;
let hasRunOnce = false;
urls.forEach(url => {
    import(url).then((module) => { 
        if (!gdjs.externalCode[behaviorName]) {
            gdjs.externalCode[behaviorName] = module[behaviorName];
        }
        if (!hasRunOnce) {
            gdjs.externalCode[behaviorName].onCreated(runtimeScene, eventsFunctionContext);
            hasRunOnce = true;
        }
    })
    .catch(error => {
        caughtErrorCount++;
        if (caughtErrorCount === urls.length) {
            console.error(`Failed to load external code for behavior ${behaviorName} from urls ${urls} with error ${error}`);
        }
    });
});