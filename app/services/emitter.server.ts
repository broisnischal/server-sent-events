import { remember } from "@epic-web/remember";
import { EventEmitter } from "node:events";

export let emitter = remember("emitter", () => new EventEmitter());
