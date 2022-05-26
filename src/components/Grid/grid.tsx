import { CoordinateType } from '../../core/Game/domain/entity/coordinate';
import { ShipType } from '../../core/Game/domain/entity/ship';
import { Line } from './line';

export const SIZE_GRID = 10;

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
  const lines = Array(SIZE_GRID).fill(undefined);

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
