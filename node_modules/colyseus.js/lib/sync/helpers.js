"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var listeners = require("./listeners");
function initializeSync(roomInstance, synchable) {
    createBindings(roomInstance, synchable, synchable);
}
exports.initializeSync = initializeSync;
function syncMap(type, addCallback, removeCallback) {
    return sync(type, 'map', addCallback, removeCallback);
}
exports.syncMap = syncMap;
function syncObject(type, addCallback, removeCallback) {
    return sync(type, 'object', addCallback, removeCallback);
}
exports.syncObject = syncObject;
function syncVar(type, addCallback, removeCallback) {
    return sync(type, 'var');
}
exports.syncVar = syncVar;
function syncList(type, addCallback, removeCallback) {
    return sync(type, 'list', addCallback, removeCallback);
}
exports.syncList = syncList;
function key() {
    return sync(undefined, 'key');
}
exports.key = key;
function room() {
    return function (proto, attr) {
        Object.defineProperty(proto, attr, {
            configurable: true,
            enumerable: true,
            get: function () { return proto.constructor.$room; },
        });
    };
}
exports.room = room;
function sync(type, holderType, addCallback, removeCallback) {
    if (holderType === void 0) { holderType = 'var'; }
    return function (target, propertyKey) {
        if (!target.constructor.properties) {
            target.constructor.properties = {};
        }
        var variable = propertyKey;
        if (typeof (type) === 'string') {
            variable = propertyKey;
            propertyKey = type;
            type = undefined;
        }
        target.constructor.properties[propertyKey] = {
            addCallback: addCallback,
            holderType: holderType,
            removeCallback: removeCallback,
            type: type,
            variable: variable,
        };
    };
}
exports.sync = sync;
function listen(path, op) {
    return function (target, methodName, descriptor) {
        if (!target.constructor.listeners) {
            target.constructor.listeners = {};
        }
        target.constructor.listeners[path] = { methodName: methodName, op: op };
    };
}
exports.listen = listen;
var listenersMap = {};
function createBindings(roomInstance, synchable, synchableRoot, parentSegment) {
    bindProperties(synchable.constructor.properties || synchable.properties, roomInstance, synchable, synchableRoot, parentSegment);
    bindListeners(synchable.constructor.listeners, roomInstance, synchable);
}
exports.createBindings = createBindings;
function bindProperties(properties, roomInstance, synchable, synchableRoot, parentSegment) {
    // no properties to sync
    if (!properties) {
        return;
    }
    // room reference
    Object.defineProperty(synchable, '$room', {
        configurable: true,
        enumerable: false,
        value: roomInstance,
        writable: true,
    });
    synchable.$room = roomInstance;
    // create bindings for properties
    for (var segment in properties) {
        if (!properties.hasOwnProperty(segment)) {
            continue;
        }
        var property = properties[segment];
        var path = (parentSegment)
            ? parentSegment + "/" + segment
            : segment;
        if (property.holderType === 'map') {
            path += '/:id';
        }
        // skip if duplicate listenersMap
        if (listenersMap[path]) {
            return;
        }
        else {
            listenersMap[path] = true;
        }
        var listener = listeners[property.holderType + "Listener"];
        if (listener) {
            roomInstance.listen(path, listener(roomInstance, property, synchable, synchableRoot, path));
            if (property.type) {
                createBindings(roomInstance, property.type, synchable, path);
            }
        }
    }
}
function bindListeners(listenersToBind, roomInstance, synchable) {
    if (!listenersToBind) {
        return;
    }
    var _loop_1 = function (path) {
        if (!listenersToBind.hasOwnProperty(path)) {
            return "continue";
        }
        var listener = listenersToBind[path];
        var callback = (listener.op)
            ? (function (change) {
                if (change.operation === listener.op) {
                    synchable[listener.methodName](change);
                }
            })
            : synchable[listener.methodName].bind(synchable);
        roomInstance.listen(path, callback);
    };
    for (var path in listenersToBind) {
        _loop_1(path);
    }
}
exports.bindListeners = bindListeners;
