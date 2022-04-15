import { Grid } from '../grid';
import { Ship } from '../ship';

export class GridBuilder {
  private ships: Ship[];

  constructor() {
    this.ships = [];
  }

  withFirstShip(ship: Ship): GridBuilder {
    if (!this.ships?.[0]) {
      this.ships.push(ship);
      return this;
    }
    this.ships[0] = ship;
    return this;
  }

  build(): Grid {
    return new Grid(this.ships);
  }
}
