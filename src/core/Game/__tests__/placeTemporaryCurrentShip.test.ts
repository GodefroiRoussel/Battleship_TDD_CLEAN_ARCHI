import { Coordinate, TYPE_COORDINATE } from '../domain/entity/coordinate';
import { DIRECTION } from '../domain/entity/direction';
import { Ship, ShipType, TYPE_SHIP } from '../domain/entity/ship';
import { PlaceTemporaryCurrentShipUsecase } from '../domain/use-cases/placeTemporaryCurrentShip';

describe('Scenario: During the start of a game, when I am a player, I want to temporary place my ship to know if I overlapse another', () => {
  it('should be able to place the ship when no ships are placed', () => {
    // Arrange
    const coordinatesExpected: Coordinate[] = [
      new Coordinate(5, 5, TYPE_COORDINATE.WATER),
      new Coordinate(6, 5, TYPE_COORDINATE.WATER),
    ];

    const typeShip = TYPE_SHIP.SUBMARINE;
    const x = 5;
    const y = 5;
    const direction = DIRECTION.RIGHT;
    const currentShips: ShipType[] = [];
    const placeTemporaryCurrentShipUsecase = new PlaceTemporaryCurrentShipUsecase();
    // Act
    const coordinates = placeTemporaryCurrentShipUsecase.execute(typeShip, x, y, direction, currentShips);
    // Assert
    coordinatesExpected.map((coordinateExpected, index) => expect(coordinateExpected).toEqual(coordinates?.[index]));
  });

  it('should be able to place the ship at another coordinates when ships are already placed', () => {
    // Arrange
    const coordinatesExpected: Coordinate[] = [
      new Coordinate(5, 5, TYPE_COORDINATE.WATER),
      new Coordinate(6, 5, TYPE_COORDINATE.WATER),
    ];

    const typeShip = TYPE_SHIP.SUBMARINE;
    const x = 5;
    const y = 5;
    const direction = DIRECTION.RIGHT;
    const ship = Ship.create(new Coordinate(0, 0), DIRECTION.RIGHT, TYPE_SHIP.DESTROYER).toJSON();
    const currentShips: ShipType[] = [ship];
    const placeTemporaryCurrentShipUsecase = new PlaceTemporaryCurrentShipUsecase();
    // Act
    const coordinates = placeTemporaryCurrentShipUsecase.execute(typeShip, x, y, direction, currentShips);
    // Assert
    coordinatesExpected.map((coordinateExpected, index) => expect(coordinateExpected).toEqual(coordinates?.[index]));
  });

  it('should inform which coordinates are overlapsing one ship already placed', () => {
    // Arrange
    const coordinatesExpected: Coordinate[] = [
      new Coordinate(6, 5, TYPE_COORDINATE.OCCUPIED),
      new Coordinate(7, 5, TYPE_COORDINATE.OCCUPIED),
      new Coordinate(8, 5, TYPE_COORDINATE.WATER),
      new Coordinate(9, 5, TYPE_COORDINATE.WATER),
    ];

    const typeShip = TYPE_SHIP.CRUISER;
    const x = 6;
    const y = 5;
    const direction = DIRECTION.RIGHT;
    const ship1 = Ship.create(new Coordinate(5, 5), DIRECTION.RIGHT, TYPE_SHIP.DESTROYER).toJSON();
    const currentShips: ShipType[] = [ship1];
    const placeTemporaryCurrentShipUsecase = new PlaceTemporaryCurrentShipUsecase();
    // Act
    const coordinates = placeTemporaryCurrentShipUsecase.execute(typeShip, x, y, direction, currentShips);
    // Assert
    coordinatesExpected.map((coordinateExpected, index) => expect(coordinateExpected).toEqual(coordinates?.[index]));
  });

  it('should inform which coordinates are overlapsing multiple ships already placed', () => {
    // Arrange
    const coordinatesExpected: Coordinate[] = [
      new Coordinate(6, 5, TYPE_COORDINATE.OCCUPIED),
      new Coordinate(7, 5, TYPE_COORDINATE.OCCUPIED),
      new Coordinate(8, 5, TYPE_COORDINATE.OCCUPIED),
      new Coordinate(9, 5, TYPE_COORDINATE.WATER),
    ];

    const typeShip = TYPE_SHIP.CRUISER;
    const x = 6;
    const y = 5;
    const direction = DIRECTION.RIGHT;
    const ship1 = Ship.create(new Coordinate(5, 5), DIRECTION.RIGHT, TYPE_SHIP.DESTROYER).toJSON();
    const ship2 = Ship.create(new Coordinate(8, 5), DIRECTION.TOP, TYPE_SHIP.DESTROYER).toJSON();
    const currentShips: ShipType[] = [ship1, ship2];
    const placeTemporaryCurrentShipUsecase = new PlaceTemporaryCurrentShipUsecase();
    // Act
    const coordinates = placeTemporaryCurrentShipUsecase.execute(typeShip, x, y, direction, currentShips);
    // Assert
    coordinatesExpected.map((coordinateExpected, index) => expect(coordinateExpected).toEqual(coordinates?.[index]));
  });

  it('should throw an error when trying to verify the placement with wrong coordinates', () => {
    const typeShip = TYPE_SHIP.CRUISER;
    const x = -1;
    const y = 0;
    const direction = DIRECTION.RIGHT;
    const currentShips: ShipType[] = [];
    const placeTemporaryCurrentShipUsecase = new PlaceTemporaryCurrentShipUsecase();

    // Act & Assert
    try {
      placeTemporaryCurrentShipUsecase.execute(typeShip, x, y, direction, currentShips);
    } catch (error) {
      expect(error).toEqual(new Error('Invalid coordinate: each axis should be a number between 0 and 10'));
    }
  });
});
