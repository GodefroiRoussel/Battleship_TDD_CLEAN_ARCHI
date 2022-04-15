import { Coordinate } from './coordinate';

export class Ship {
  constructor(private coordinateStart: Coordinate, private coordinateEnd: Coordinate, private typeShip: string) {}
}
