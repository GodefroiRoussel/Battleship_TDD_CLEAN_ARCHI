import { Ship, TYPE_SHIP } from './ship';
import { Coordinate } from './coordinate';
import { DIRECTION } from './direction';

export class Player {
  constructor(
    private _id: string,
    private _name: string,
    private _ships: Ship[] = [],
    private _listCoordinatesShot: Coordinate[] = [],
  ) {}

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get ships(): Ship[] {
    return this._ships;
  }

  public get listCoordinatesShot(): Coordinate[] {
    return this._listCoordinatesShot;
  }

  addShip(typeShip: TYPE_SHIP, coordinatesStart: Coordinate, direction: DIRECTION): void {
    const ship = Ship.create(coordinatesStart, direction, typeShip);
    this.ships.forEach((shipSaved) => {
      if (
        shipSaved.coordinates.some(
          (coordinate) => coordinate.equals(ship.coordinates[0]) || coordinate.equals(ship.coordinates[1]),
        )
      ) {
        throw new Error('A ship is already on one of those coordinates');
      }
    });
    this.ships.push(ship);
  }

  shot(coordinate: Coordinate): void {
    this.listCoordinatesShot.push(coordinate);
  }
}
