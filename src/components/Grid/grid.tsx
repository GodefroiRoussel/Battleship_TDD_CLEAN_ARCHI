import { Coordinate, CoordinateType, TYPE_COORDINATE } from '../../core/Game/domain/entity/coordinate';
import { ShipType } from '../../core/Game/domain/entity/ship';

enum TYPE_COORDINATE_CELL {
  ALREADY_SHOT = 'ALREADY_SHOT',
  WATER = 'WATER',
  OCCUPIED = 'OCCUPIED',
  FUTURE = 'FUTURE',
  OVERLAPSE = 'OVERLAPSE',
  PLOUF = 'PLOUF',
  TOUCHED = 'TOUCHED',
  UNKNOWN = 'UNKNOWN',
  TO_SHOOT = 'TO_SHOOT',
}

export const Grid = ({
  ships,
  coordinatesShot,
  temporaryShip,
  typeGrid,
  coordinateToShoot,
}: {
  ships: ShipType[];
  coordinatesShot?: CoordinateType[];
  temporaryShip?: ShipType;
  typeGrid?: 'ennemy' | 'view_all';
  coordinateToShoot?: CoordinateType;
}): JSX.Element => {
  const lines = Array(10).fill(undefined);

  return (
    <>
      <div>Grid</div>
      <div style={{ display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-around' }}>
        {lines.map((_, index) => {
          return (
            <Line
              key={index}
              typeGrid={typeGrid}
              indexLine={index}
              coordinatesShot={coordinatesShot}
              temporaryShip={temporaryShip}
              ships={ships}
              coordinateToShoot={coordinateToShoot}
            />
          );
        })}
      </div>
    </>
  );
};

const Line = ({
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
  const columns = Array(10).fill(undefined);
  try {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        {columns.map((_, indexColumn) => {
          const currentCoordinate = new Coordinate(indexColumn, indexLine);
          const coordinatesAllShipsPlaced = ships.flatMap((ship) => ship._coordinates);
          const id = `${indexLine.toString()} ${indexColumn.toString()}`;

          if (typeGrid && typeGrid === 'view_all') {
            if (coordinatesShot) {
              const currentCoordinateHasBeenShot = isCurrentCoordinateHasBeenShot(coordinatesShot);
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

          if (coordinateToShoot && isCurrentCoordinate(coordinateToShoot)) {
            if (coordinatesShot && isCurrentCoordinateHasBeenShot(coordinatesShot)) {
              return <Cell key={id} id={id} typeCoordinate={TYPE_COORDINATE_CELL.ALREADY_SHOT} />;
            }
            return <Cell key={id} id={id} typeCoordinate={TYPE_COORDINATE_CELL.TO_SHOOT} />;
          }
          if (coordinatesShot) {
            const currentCoordinateHasBeenShot = isCurrentCoordinateHasBeenShot(coordinatesShot);
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

          if (isCurrentCoordinateOccupiedAndTryToPlaceCurrentShip()) {
            return <Cell key={id} id={id} typeCoordinate={TYPE_COORDINATE_CELL.OVERLAPSE} />;
          }

          if (isCurrentCoordinateOccupied()) {
            return <Cell key={id} id={id} typeCoordinate={TYPE_COORDINATE_CELL.OCCUPIED} />;
          }

          if (isCurrentCoordinateToPlaceCurrentShip()) {
            return <Cell key={id} id={id} typeCoordinate={TYPE_COORDINATE_CELL.FUTURE} />;
          }

          return <Cell key={id} id={id} typeCoordinate={TYPE_COORDINATE_CELL.WATER} />;

          function isCurrentCoordinate(coordinateToShoot: CoordinateType) {
            return coordinateToShoot.x === currentCoordinate.x && coordinateToShoot.y === currentCoordinate.y;
          }

          function isCurrentCoordinateToPlaceCurrentShip() {
            if (!temporaryShip) {
              return false;
            }

            return (
              temporaryShip._coordinates.filter(
                (coordinateCurrentShip) =>
                  coordinateCurrentShip.x === currentCoordinate.x && coordinateCurrentShip.y === currentCoordinate.y,
              ).length > 0
            );
          }

          function isCurrentCoordinateHasBeenShot(coordinatesShot: CoordinateType[]): CoordinateType | undefined {
            return coordinatesShot.find((coordinateShot) => {
              return coordinateShot.x === currentCoordinate.x && coordinateShot.y === currentCoordinate.y;
            });
          }

          function isCurrentCoordinateOccupied() {
            return (
              coordinatesAllShipsPlaced.filter((coordinateAlreadyPlaced) => {
                return coordinateAlreadyPlaced.x === indexColumn && coordinateAlreadyPlaced.y === indexLine;
              }).length === 1
            );
          }

          function isCurrentCoordinateOccupiedAndTryToPlaceCurrentShip() {
            if (!temporaryShip) {
              return false;
            }

            return (
              temporaryShip._coordinates.filter(
                (coordinateCurrentShip) =>
                  coordinateCurrentShip.type === TYPE_COORDINATE.OCCUPIED &&
                  coordinateCurrentShip.x === currentCoordinate.x &&
                  coordinateCurrentShip.y === currentCoordinate.y,
              ).length > 0
            );
          }
        })}
      </div>
    );
  } catch (error) {
    throw new Error('error');
  }
};

const Cell = ({ id, typeCoordinate }: { id: string; typeCoordinate: TYPE_COORDINATE_CELL }): JSX.Element => {
  let text: string;
  let style = {
    border: 'solid',
    width: '100%',
    display: 'flex',
    flex: 1,
    backgroundColor: 'blue',
    minHeight: '5vh',
    justifyContent: 'center',
    alignItems: 'center',
  };
  switch (typeCoordinate) {
    case TYPE_COORDINATE_CELL.ALREADY_SHOT:
      style = { ...style, backgroundColor: 'purple' };
      text = TYPE_COORDINATE_CELL.ALREADY_SHOT;
      break;
    case TYPE_COORDINATE_CELL.UNKNOWN:
      style = { ...style, backgroundColor: 'grey' };
      text = TYPE_COORDINATE_CELL.UNKNOWN;
      break;
    case TYPE_COORDINATE_CELL.OCCUPIED:
      style = { ...style, backgroundColor: 'grey' };
      text = TYPE_COORDINATE_CELL.OCCUPIED;
      break;

    case TYPE_COORDINATE_CELL.FUTURE:
      style = { ...style, backgroundColor: 'green' };
      text = TYPE_COORDINATE_CELL.FUTURE;
      break;
    case TYPE_COORDINATE_CELL.TO_SHOOT:
      style = { ...style, backgroundColor: 'green' };
      text = TYPE_COORDINATE_CELL.TO_SHOOT;
      break;

    case TYPE_COORDINATE_CELL.TOUCHED:
      style = { ...style, backgroundColor: 'red' };
      text = TYPE_COORDINATE_CELL.TOUCHED;
      break;
    case TYPE_COORDINATE_CELL.OVERLAPSE:
      style = { ...style, backgroundColor: 'red' };
      text = TYPE_COORDINATE_CELL.OVERLAPSE;
      break;

    case TYPE_COORDINATE_CELL.PLOUF:
      style = { ...style, backgroundColor: 'cyan' };
      text = TYPE_COORDINATE_CELL.PLOUF;
      break;

    default:
      text = TYPE_COORDINATE_CELL.WATER;
      break;
  }

  return (
    <div key={id} style={style} id={id}>
      {text}
    </div>
  );
};
