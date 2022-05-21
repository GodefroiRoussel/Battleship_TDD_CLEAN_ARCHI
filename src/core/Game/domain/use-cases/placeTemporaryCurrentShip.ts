import { Coordinate, CoordinateType, TYPE_COORDINATE } from '../entity/coordinate';
import { DIRECTION } from '../entity/direction';
import { Ship, ShipType, TYPE_SHIP } from '../entity/ship';

export class PlaceTemporaryCurrentShipUsecase {
  execute(typeShip: TYPE_SHIP, x: number, y: number, direction: DIRECTION, ships: ShipType[]): CoordinateType[] {
    try {
      const shipBeingPlaced = Ship.create(new Coordinate(x, y), direction, typeShip);

      if (ships.length > 0) {
        const coordinatesShips = ships.flatMap((ship) => ship._coordinates);
        const coordinates = shipBeingPlaced.coordinates.map((coordinate) => {
          const coordinatesFiltered = coordinatesShips.filter((coordinatePlacedType) => {
            const coordinatePlaced = new Coordinate(
              coordinatePlacedType.x,
              coordinatePlacedType.y,
              coordinatePlacedType.type,
            );
            return coordinate.equals(coordinatePlaced);
          });
          if (coordinatesFiltered.length > 0) {
            return { x: coordinate.x, y: coordinate.y, type: TYPE_COORDINATE.OCCUPIED };
          }
          return { x: coordinate.x, y: coordinate.y, type: TYPE_COORDINATE.WATER };
        });

        return coordinates;
      }

      return shipBeingPlaced.coordinates.map((coordinate) => {
        return { x: coordinate.x, y: coordinate.y, type: TYPE_COORDINATE.WATER };
      });
    } catch (error) {
      throw error;
    }
  }
}
