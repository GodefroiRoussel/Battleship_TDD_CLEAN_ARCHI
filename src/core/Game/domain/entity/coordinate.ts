import { DIRECTION } from './direction';

// C'est un value object !
export class Coordinate {
  constructor(public readonly x: number, public readonly y: number) {}

  next(direction: DIRECTION): Coordinate {
    switch (direction) {
      case DIRECTION.BOTTOM:
        return new Coordinate(this.x, this.y - 1);

      case DIRECTION.TOP:
        return new Coordinate(this.x, this.y + 1);

      case DIRECTION.LEFT:
        return new Coordinate(this.x + -1, this.y);

      default:
        return new Coordinate(this.x + 1, this.y);
    }
  }

  equals(otherCoordinate: Coordinate): boolean {
    if (this.x === otherCoordinate.x && this.y === otherCoordinate.y) {
      return true;
    }
    return false;
  }
}
