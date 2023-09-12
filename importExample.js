function gdevelopImport(runtimeScene) {
    if ((!this.code && !this.importing)) {
        const mainUrl = "http://localhost:5500/menu.js";
        const fallbackUrl = "https://github.etdofresh.com/GDevelop-TappyPlaneJS/menu.js";
        this.importing = true;
        import(mainUrl).catch(() => import(fallbackUrl)).then((module) => {
            this.code = module.processEvents;
            this.importing = false;
            this.code(runtimeScene, true);
        });
    } else if (this.code) {
        this.code(runtimeScene);
    }
}