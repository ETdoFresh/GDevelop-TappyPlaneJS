import { GDevelopBehavior } from "./GDevelopBehavior.js";

export class ConsoleLogEvents extends GDevelopBehavior {
    onCreated() {
        console.log("[ConsoleLogEvents] onCreated()");
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