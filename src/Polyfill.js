/*
 IMPORTANT: This file is meant to polyfill functions if they are not provided. As such it is considered DANGEROUS and should be done very carefully (i.e. accidentally overriding Object would break everything).
 */
import {decode, encode} from "base-64";
import {EventEmitter} from "events";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

// Avoid using node dependent modules
process.browser = true;
if (typeof Buffer === "undefined") global.Buffer = require("buffer").Buffer;
EventEmitter.EventEmitter.defaultMaxListeners = 20;
