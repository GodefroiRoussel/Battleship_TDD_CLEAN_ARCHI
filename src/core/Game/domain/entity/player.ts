import { Grid, Ship } from '../../__tests__/placeShip.test';
import { Coordinate } from '../use-cases/placeShipUsecase';

export class Player {
  constructor(private _id: string, private _name: string, private _grid: Grid) {}

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get grid(): Grid {
    return this._grid;
  }

  addShip(typeShip: string, coordinatesStart: Coordinate, direction: string): void {
    const coordinateEnd = coordinatesStart.next(direction);
    const ship = new Ship(coordinatesStart, coordinateEnd, typeShip);
    this._grid.addShip(ship);
  }
}
