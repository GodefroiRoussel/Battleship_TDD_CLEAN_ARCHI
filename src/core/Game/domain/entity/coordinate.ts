// C'est un value object !
export class Coordinate {
  constructor(public readonly x: number, public readonly y: number) {}

  next(direction: string): Coordinate {
    switch (direction) {
      case 'BOTTOM':
        return new Coordinate(this.x, this.y - 1);

      case 'TOP':
        return new Coordinate(this.x, this.y + 1);

      case 'LEFT':
        return new Coordinate(this.x + -1, this.y);

      default:
        return new Coordinate(this.x + 1, this.y);
    }
  }
}
