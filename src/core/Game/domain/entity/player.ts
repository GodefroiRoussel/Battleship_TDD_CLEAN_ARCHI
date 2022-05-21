import { Ship, ShipType, TYPE_SHIP } from './ship';
import { Coordinate, CoordinateType, TYPE_COORDINATE } from './coordinate';
import { DIRECTION } from './direction';

export type PlayerType = {
  _id: string;
  _name: string;
  _ships: ShipType[];
  _listCoordinatesShot: CoordinateType[];
};

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
    const shipToCreate = Ship.create(coordinatesStart, direction, typeShip);
    this.ships.forEach((shipSaved) => {
      if (
        shipSaved.coordinates.some((coordinate) => {
          return (
            shipToCreate.coordinates.filter((coordinateToCreate) => coordinate.equalsLocation(coordinateToCreate))
              .length > 0
          );
        })
      ) {
        throw new Error('A ship is already on one of those coordinates');
      }
    });
    this.ships.push(shipToCreate);
  }

  shot(coordinate: Coordinate, opponent: Player): void {
    if (this.listCoordinatesShot.filter((coordinateShot) => coordinateShot.equalsLocation(coordinate)).length > 0) {
      throw new Error('This coordinate has already been shot');
    }

    opponent.ships.map((ship) => {
      if (ship.coordinates.filter((coordinateShip) => coordinateShip.equalsLocation(coordinate)).length > 0) {
        ship.shot();
        this.listCoordinatesShot.push(new Coordinate(coordinate.x, coordinate.y, TYPE_COORDINATE.TOUCHED));
      }
      return ship;
    });

    this.listCoordinatesShot.push(new Coordinate(coordinate.x, coordinate.y, TYPE_COORDINATE.WATER));
  }

  life(): number {
    return this._ships.reduce((accumulator: number, ship: Ship) => {
      return accumulator + ship.life;
    }, 0);
  }

  toJSON(): PlayerType {
    return {
      _id: this._id,
      _name: this._name,
      _ships: this._ships.map((ship) => ship.toJSON()),
      _listCoordinatesShot: this._listCoordinatesShot.map((coordinate) => coordinate.toJSON()),
    };
  }
}
