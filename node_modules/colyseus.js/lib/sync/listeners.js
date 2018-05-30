"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers");
function assign(instance, property, propName, value, key) {
    if (property.holderType === 'var') {
        instance[propName] = value;
    }
    else if (property.holderType === 'key') {
        // mapListener only
        instance[propName] = key;
    }
}
function assignMultiple(instance, properties, value, key) {
    for (var prop in properties) {
        if (!properties.hasOwnProperty(prop)) {
            continue;
        }
        assign(instance, properties[prop], prop, value[prop], key);
    }
}
function getInstanceContainer(root, path, offset) {
    if (offset === void 0) { offset = 0; }
    var instance = root;
    for (var i = 0, len = path.length; i < len + offset; i++) {
        if (typeof (instance[path[i]]) !== 'object') {
            break;
        }
        instance = instance[path[i]];
    }
    return instance;
}
function objectListener(room, property, synchable, synchableRoot, parentSegment) {
    return function (change) {
        if (change.operation === 'add') {
            var newType = new property.type();
            // assign all variables to new instance type
            for (var prop in change.value) {
                if (!change.value.hasOwnProperty(prop)) {
                    continue;
                }
                newType[prop] = change.value[prop];
            }
            // bind @listen annotations
            helpers_1.bindListeners(property.type.listeners, room, newType);
            synchable[property.variable] = newType;
            if (property.addCallback) {
                property.addCallback.call(synchableRoot, synchableRoot, newType, change);
            }
        }
        else if (change.operation === 'replace') {
            synchableRoot[this.rawRules[0]][property.variable] = change.value;
        }
        else if (change.operation === 'remove') {
            if (property.removeCallback) {
                property.removeCallback.call(synchableRoot, synchableRoot, synchable[property.variable][change.path.id], change);
            }
            delete synchable[property.variable];
        }
    };
}
exports.objectListener = objectListener;
function mapListener(room, property, synchable, synchableRoot, parentSegment) {
    return function (change) {
        var instance = getInstanceContainer(synchableRoot, change.rawPath);
        if (change.operation === 'add') {
            var newType = new property.type();
            // define __mapParent as non-enumerable.
            Object.defineProperty(newType, '__mapParent', {
                configurable: true,
                enumerable: false,
                value: getInstanceContainer(synchableRoot, change.rawPath, -2),
                writable: true,
            });
            // bind @listen annotations
            helpers_1.bindListeners(property.type.listeners, room, newType);
            instance[change.path.id] = newType;
            // assign all variables to new instance type
            assignMultiple(newType, property.type.properties, change.value, change.path.id);
            if (property.addCallback) {
                property.addCallback.call(newType.__mapParent, newType.__mapParent, newType, change);
            }
        }
        else if (change.operation === 'replace') {
            assign(instance, property, property.variable, change.value);
        }
        else if (change.operation === 'remove') {
            if (property.removeCallback) {
                property.removeCallback.call(instance.__mapParent, instance.__mapParent, instance, change);
            }
            delete synchable[property.variable][change.path.id];
        }
    };
}
exports.mapListener = mapListener;
function varListener(room, property, synchable, synchableRoot, parentSegment) {
    return function (change) {
        var target = getInstanceContainer(synchableRoot, change.rawPath);
        if (change.operation !== 'remove') {
            assign(target, property, property.variable, change.value);
        }
        else if (change.operation === 'remove') {
            delete target[property.variable];
        }
    };
}
exports.varListener = varListener;
