import { Coordinate } from './coordinate';
import { DIRECTION } from './direction';

// The types of ships are:  Carrier (occupies 5 spaces, Cruiser (4),  Destroyer (3) and Submarine (2).
export enum TYPE_SHIP {
  SUBMARINE = 'SUBMARINE',
  DESTROYER = 'DESTROYER',
  CRUISER = 'CRUISER',
  CARRIER = 'CARRIER',
}

export class Ship {
  constructor(private _coordinates: Coordinate[], private _typeShip: TYPE_SHIP) {}

  public get coordinates(): Coordinate[] {
    return this._coordinates;
  }

  public get typeShip(): TYPE_SHIP {
    return this._typeShip;
  }

  public static create(coordinateStart: Coordinate, direction: DIRECTION, typeShip: TYPE_SHIP): Ship {
    let size = 2;
    switch (typeShip) {
      case TYPE_SHIP.CARRIER:
        size = 5;
        break;
      case TYPE_SHIP.CRUISER:
        size = 4;
        break;
      case TYPE_SHIP.DESTROYER:
        size = 3;
        break;
      default:
        break;
    }

    const coordinates = [coordinateStart];
    let tempCoordinate: Coordinate = coordinateStart;
    for (let index = 1; index < size; index++) {
      tempCoordinate = tempCoordinate.next(direction);
      coordinates.push(tempCoordinate);
    }
    return new Ship(coordinates, typeShip);
  }
}
