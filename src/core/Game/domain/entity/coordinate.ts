import { DIRECTION } from './direction';

// C'est un value object !

export type CoordinateType = {
  x: number;
  y: number;
  type?: TYPE_COORDINATE;
};

export enum TYPE_COORDINATE {
  TOUCHED = 'TOUCHED',
  WATER = 'WATER',
  OCCUPIED = 'OCCUPIED',
}

export const invalidCoordinateError = new Error('Invalid coordinate: each axis should be a number between 0 and 10');
export class Coordinate {
  constructor(public readonly x: number, public readonly y: number, public readonly type?: TYPE_COORDINATE) {
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
        return new Coordinate(this.x, this.y - 1, this.type);

      case DIRECTION.TOP:
        return new Coordinate(this.x, this.y + 1, this.type);

      case DIRECTION.LEFT:
        return new Coordinate(this.x + -1, this.y, this.type);

      default:
        return new Coordinate(this.x + 1, this.y, this.type);
    }
  }

  equalsLocation(otherCoordinate: Coordinate): boolean {
    if (this.x === otherCoordinate.x && this.y === otherCoordinate.y) {
      return true;
    }
    return false;
  }

  equals(otherCoordinate: Coordinate): boolean {
    if (this.equalsLocation(otherCoordinate) && this.type === otherCoordinate.type) {
      return true;
    }
    return false;
  }

  public toJSON(): CoordinateType {
    return {
      x: this.x,
      y: this.y,
      type: this.type,
    };
  }
}
