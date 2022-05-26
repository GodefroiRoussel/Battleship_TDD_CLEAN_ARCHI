import { Coordinate, CoordinateType, TYPE_COORDINATE } from '../../core/Game/domain/entity/coordinate';
import { ShipType } from '../../core/Game/domain/entity/ship';
import { Cell, TYPE_COORDINATE_CELL } from './cell';
import { SIZE_GRID } from './grid';

export const Line = ({
  indexLine,
  coordinatesShot,
  temporaryShip,
  ships,
  typeGrid,
  coordinateToShoot,
}: {
  indexLine: number;
  ships: ShipType[];
  coordinatesShot?: CoordinateType[];
  temporaryShip?: ShipType;
  typeGrid?: 'ennemy' | 'view_all';
  coordinateToShoot?: CoordinateType;
}): JSX.Element => {
  const columns = Array(SIZE_GRID).fill(undefined);
  try {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        {columns.map((_, indexColumn) => {
          const currentCoordinate = new Coordinate(indexColumn, indexLine);
          const coordinatesAllShipsPlaced = ships.flatMap((ship) => ship._coordinates);
          const id = `${indexLine.toString()} ${indexColumn.toString()}`;

          if (typeGrid && typeGrid === 'view_all') {
            if (coordinatesShot) {
              const currentCoordinateHasBeenShot = isCurrentCoordinateHasBeenShot(coordinatesShot, currentCoordinate);
              if (currentCoordinateHasBeenShot) {
                let typeCell =
                  currentCoordinateHasBeenShot.type === TYPE_COORDINATE.TOUCHED
                    ? TYPE_COORDINATE_CELL.TOUCHED
                    : TYPE_COORDINATE_CELL.WATER;
                if (typeCell === TYPE_COORDINATE_CELL.WATER) typeCell = TYPE_COORDINATE_CELL.PLOUF;
                return <Cell key={id} id={id} typeCoordinate={typeCell} />;
              }
            }
          }

          if (coordinateToShoot && isCurrentCoordinate(currentCoordinate, coordinateToShoot)) {
            if (coordinatesShot && isCurrentCoordinateHasBeenShot(coordinatesShot, currentCoordinate)) {
              return <Cell key={id} id={id} typeCoordinate={TYPE_COORDINATE_CELL.ALREADY_SHOT} />;
            }
            return <Cell key={id} id={id} typeCoordinate={TYPE_COORDINATE_CELL.TO_SHOOT} />;
          }

          if (coordinatesShot) {
            const currentCoordinateHasBeenShot = isCurrentCoordinateHasBeenShot(coordinatesShot, currentCoordinate);
            if (currentCoordinateHasBeenShot) {
              let typeCell =
                currentCoordinateHasBeenShot.type === TYPE_COORDINATE.TOUCHED
                  ? TYPE_COORDINATE_CELL.TOUCHED
                  : TYPE_COORDINATE_CELL.WATER;
              if (typeGrid !== 'ennemy' && typeCell === TYPE_COORDINATE_CELL.WATER)
                typeCell = TYPE_COORDINATE_CELL.PLOUF;
              return <Cell key={id} id={id} typeCoordinate={typeCell} />;
            } else if (typeGrid === 'ennemy') {
              return <Cell key={id} id={id} typeCoordinate={TYPE_COORDINATE_CELL.UNKNOWN} />;
            }
          }

          if (isCurrentCoordinateOccupiedAndTryToPlaceCurrentShip(temporaryShip, currentCoordinate)) {
            return <Cell key={id} id={id} typeCoordinate={TYPE_COORDINATE_CELL.OVERLAPSE} />;
          }

          if (isCurrentCoordinateOccupied(coordinatesAllShipsPlaced, currentCoordinate)) {
            return <Cell key={id} id={id} typeCoordinate={TYPE_COORDINATE_CELL.OCCUPIED} />;
          }

          if (isCurrentCoordinateToPlaceCurrentShip(temporaryShip, currentCoordinate)) {
            return <Cell key={id} id={id} typeCoordinate={TYPE_COORDINATE_CELL.FUTURE} />;
          }

          return <Cell key={id} id={id} typeCoordinate={TYPE_COORDINATE_CELL.WATER} />;
        })}
      </div>
    );
  } catch (error) {
    throw new Error('error');
  }
};

function isCurrentCoordinate(currentCoordinate: CoordinateType, otherCoordinate: CoordinateType) {
  return otherCoordinate.x === currentCoordinate.x && otherCoordinate.y === currentCoordinate.y;
}

function isCurrentCoordinateHasBeenShot(
  coordinatesShot: CoordinateType[],
  currentCoordinate: CoordinateType,
): CoordinateType | undefined {
  return coordinatesShot.find((coordinateShot) => {
    return coordinateShot.x === currentCoordinate.x && coordinateShot.y === currentCoordinate.y;
  });
}

function isCurrentCoordinateOccupiedAndTryToPlaceCurrentShip(
  temporaryShip: ShipType | undefined,
  currentCoordinate: CoordinateType,
) {
  if (!temporaryShip) {
    return false;
  }

  return (
    temporaryShip._coordinates.filter(
      (coordinateCurrentShip) =>
        coordinateCurrentShip.type === TYPE_COORDINATE.OCCUPIED &&
        isCurrentCoordinate(currentCoordinate, coordinateCurrentShip),
    ).length > 0
  );
}

function isCurrentCoordinateOccupied(coordinatesAllShipsPlaced: CoordinateType[], currentCoordinate: CoordinateType) {
  return (
    coordinatesAllShipsPlaced.filter((coordinateAlreadyPlaced) => {
      return isCurrentCoordinate(currentCoordinate, coordinateAlreadyPlaced);
    }).length === 1
  );
}

function isCurrentCoordinateToPlaceCurrentShip(temporaryShip: ShipType | undefined, currentCoordinate: CoordinateType) {
  if (!temporaryShip) {
    return false;
  }

  return (
    temporaryShip._coordinates.filter((coordinateCurrentShip) =>
      isCurrentCoordinate(currentCoordinate, coordinateCurrentShip),
    ).length > 0
  );
}
