import { Ship } from './ship';

export class Grid {
  constructor(private ships: Ship[]) {}

  addShip(ship: Ship): void {
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
}
