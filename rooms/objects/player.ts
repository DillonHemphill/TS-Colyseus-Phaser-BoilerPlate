import { nosync } from "colyseus";

export class Player 
{
    id: String;
    x: Number;
    y: Number;
    angle: Number;

    @nosync
    pendingChanges: any = [];
    constructor(id, x, y, angle) 
    {
        this.id = id;
        this.x = x;
        this.y = y;
        this.angle = angle;
    }
}