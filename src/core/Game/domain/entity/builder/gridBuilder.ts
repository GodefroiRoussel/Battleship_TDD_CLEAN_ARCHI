import { Grid } from '../grid';
import { Ship } from '../ship';

export class GridBuilder {
  private ships: Ship[];

  constructor() {
    this.ships = [];
  }

  withShips(ships: Ship[]): GridBuilder {
    this.ships = ships;
    return this;
  }

  build(): Grid {
    return new Grid(this.ships);
  }
}
