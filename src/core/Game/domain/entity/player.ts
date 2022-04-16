import { Ship } from './ship';
import { Grid } from './grid';
import { Coordinate } from './coordinate';
import { DIRECTION } from './direction';

export class Player {
  constructor(private _id: string, private _name: string, private _grid: Grid = new Grid([])) {}

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get grid(): Grid {
    return this._grid;
  }

  addShip(typeShip: string, coordinatesStart: Coordinate, direction: DIRECTION): void {
    const coordinateEnd = coordinatesStart.next(direction);
    const ship = new Ship(coordinatesStart, coordinateEnd, typeShip);
    this._grid.addShip(ship);
  }
}
