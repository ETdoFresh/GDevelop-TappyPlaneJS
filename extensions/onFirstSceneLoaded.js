// Single url loading
// let urlPrefix = location.href.startsWith("file") ?
//     "http://localhost:5500/extensions" :
//     "https://github.etdofresh.com/GDevelop-TappyPlaneJS/extensions";
// let url = `${urlPrefix}/ellipseMovement.js`;

// gdjs.externalCode = gdjs.externalCode || {};
// import(url).then((module) => { gdjs.externalCode.ellipseMovement = module.ellipseMovement; })



// Multiple urls async loading
let urlPrefix = location.href.startsWith("file") ?
    "http://localhost:5500/extensions/" :
    "https://github.etdofresh.com/GDevelop-TappyPlaneJS/extensions/";

let urls = [
    `${urlPrefix}characterAnimator.js`,
    `${urlPrefix}characterController.js`, 
    `${urlPrefix}characterState.js`];

gdjs.externalCode = gdjs.externalCode || {};
urls.forEach(url => {
    import(url).then((module) => { 
        const scriptName = url.split("/").pop().split(".")[0];
        gdjs.externalCode[scriptName] = module[scriptName];
    })
});