import { DataChange } from '@gamestdio/state-listener';
import { Room } from '../Room';
import { Property, Synchable } from './types';
export declare function objectListener(room: Room, property: Property, synchable: Synchable, synchableRoot?: Synchable, parentSegment?: string): (change: DataChange) => void;
export declare function mapListener(room: Room, property: Property, synchable: Synchable, synchableRoot?: Synchable, parentSegment?: string): (change: DataChange) => void;
export declare function varListener(room: Room, property: Property, synchable: Synchable, synchableRoot?: Synchable, parentSegment?: string): (change: DataChange) => void;
