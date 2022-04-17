import { DIRECTION } from './direction';

// C'est un value object !

export const invalidCoordinateError = new Error('Invalid coordinate: each axis should be a number between 0 and 10');
export class Coordinate {
  constructor(public readonly x: number, public readonly y: number) {
    if (!this.isNumberInTheGrid(x) || !this.isNumberInTheGrid(y)) {
      throw invalidCoordinateError;
    }
  }

  private isNumberInTheGrid(num: number): boolean {
    return num >= 0 && num <= 10;
  }

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

export enum TYPE_COORDINATE {
  TOUCHED = 'TOUCHED',
  WATER = 'WATER',
}

export class CoordinateShot extends Coordinate {
  constructor(public x: number, public y: number, public typeCoordinate: TYPE_COORDINATE) {
    super(x, y);
  }
}
