import { Room } from '../Room';
import { Synchable } from './types';
export declare function initializeSync(roomInstance: Room, synchable: any & Synchable): void;
export declare function syncMap(type?: any, addCallback?: Function, removeCallback?: Function): PropertyDecorator;
export declare function syncObject(type?: any, addCallback?: Function, removeCallback?: Function): PropertyDecorator;
export declare function syncVar(type?: any, addCallback?: Function, removeCallback?: Function): PropertyDecorator;
export declare function syncList(type?: any, addCallback?: Function, removeCallback?: Function): PropertyDecorator;
export declare function key(): PropertyDecorator;
export declare function room(): (proto: any, attr: string) => void;
export declare function sync(type?: any, holderType?: string, addCallback?: Function, removeCallback?: Function): PropertyDecorator;
export declare function listen(path: string, op?: string): MethodDecorator;
export declare function createBindings(roomInstance: Room, synchable: any & Synchable, synchableRoot?: any & Synchable, parentSegment?: string): void;
export declare function bindListeners(listenersToBind: {
    [path: string]: any;
}, roomInstance: Room, synchable: any & Synchable): void;
