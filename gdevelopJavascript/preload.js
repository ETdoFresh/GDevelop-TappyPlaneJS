const behaviorName = eventsFunctionContext.getArgument("BehaviorName");

if (gdjs.externalCode && gdjs.externalCode[behaviorName]) {
    return eventsFunctionContext.returnValue = true;
}

this.runOnce = this.runOnce || {};
if (this.runOnce[behaviorName]) {
    return eventsFunctionContext.returnValue = false;
}
this.runOnce[behaviorName] = true;

const urls = [
    `https://github.etdofresh.com/GDevelop-TappyPlaneJS/myIdeal/${behaviorName}.js`,
];

if (location.href.startsWith("file:///"))
    urls.unshift(`http://localhost:5500/myIdeal/${behaviorName}.js`);

let caughtErrorCount = 0;

gdjs.externalCode = gdjs.externalCode || {};
urls.forEach(url => {
    import(url).then((module) => { 
        if (gdjs.externalCode[behaviorName]) return;
        gdjs.externalCode[behaviorName] = module[behaviorName];
        eventsFunctionContext.returnValue = true;

    })
    .catch(error => {
        caughtErrorCount++;
        if (caughtErrorCount === urls.length) {
            console.error(`Failed to load external code for behavior ${behaviorName} from urls ${urls} with error ${error}`);
        }
    });
});