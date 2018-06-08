import { nosync } from "colyseus";

export class Player 
{
    id: String;
    x: Number;
    y: Number;
    rotation: Number;
    @nosync
    pendingChanges: any = [];
    constructor(id, x, y, rotation) 
    {
        this.id = id;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }
}