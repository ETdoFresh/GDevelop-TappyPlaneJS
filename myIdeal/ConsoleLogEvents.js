import { GDevelopBehavior } from "./GDevelopBehavior";

export class ConsoleLogEvents extends GDevelopBehavior {
    onCreate() {
        console.log("[ConsoleLogEvents] onCreate()");
    }

    onDestroy() {
        console.log("[ConsoleLogEvents] onDestroy()");
    }

    onActivate() {
        console.log("[ConsoleLogEvents] onActivate()");
    }

    onDeActivate() {
        console.log("[ConsoleLogEvents] onDeActivate()");
    }

    doStepPreEvents(delta) {
        console.log("[ConsoleLogEvents] doStepPreEvents()");
    }

    doStepPostEvents(delta) {
        console.log("[ConsoleLogEvents] doStepPostEvents()");
    }
}