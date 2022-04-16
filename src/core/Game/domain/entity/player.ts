import { Ship, TYPE_SHIP } from './ship';
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

  addShip(typeShip: TYPE_SHIP, coordinatesStart: Coordinate, direction: DIRECTION): void {
    const ship = Ship.create(coordinatesStart, direction, typeShip);
    this._grid.addShip(ship);
  }
}
