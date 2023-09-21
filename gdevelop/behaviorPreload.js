const urlFolder = "behaviors";
const behaviorName = eventsFunctionContext.getArgument("BehaviorName");

gdjs.externalCode = gdjs.externalCode || {};
if (gdjs.externalCode[behaviorName]) {
    return eventsFunctionContext.returnValue = true;
}

this.runOnce = this.runOnce || {};
if (this.runOnce[behaviorName]) {
    return eventsFunctionContext.returnValue = false;
}
this.runOnce[behaviorName] = true;

const urlsCombined = gdjs.evtsExt__ExternalCode__getUrls.func();
const urls = urlsCombined.split(",").map(url => `${url}/${urlFolder}/${behaviorName}.js`);

let caughtErrorCount = 0;
urls.forEach(url => {
    import(url).then((module) => { 
        if (gdjs.externalCode[behaviorName]) return;
        gdjs.externalCode[behaviorName] = module[behaviorName];
        eventsFunctionContext.returnValue = true;

    })
    .catch(error => {
        caughtErrorCount++;
        if (caughtErrorCount === urls.length) {
            console.error(`[behaviorPreload] Failed to load external code for behavior ${behaviorName} from urls ${urls} with error ${error}`);
        }
    });
});