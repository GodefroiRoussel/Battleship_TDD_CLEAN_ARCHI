import { Ship } from './ship';

export class Grid {
  constructor(private ships: Ship[]) {}

  addShip(ship: Ship): void {
    this.ships.push(ship);
  }
}
