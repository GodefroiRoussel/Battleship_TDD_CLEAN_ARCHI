import { InMemoryGameRepository } from '../adapters/in-memory/InMemoryGameRepository';
import { Game } from '../domain/entity/game';
import { Player } from '../domain/entity/player';
import { PlaceShipUsecase } from '../domain/use-cases/placeShipUsecase';
import { Coordinate } from '../domain/entity/coordinate';
import { StubGameBuilder } from '../domain/entity/builder/gameBuilder';
import { Ship, TYPE_SHIP } from '../domain/entity/ship';
import { GridBuilder } from '../domain/entity/builder/gridBuilder';
import { Grid } from '../domain/entity/grid';
import { DIRECTION } from '../domain/entity/direction';

let game: Game;
let inMemoryGameRepository: InMemoryGameRepository;
let placeShipUsecase: PlaceShipUsecase;
let coordinatesStart: Coordinate;
let direction: DIRECTION;

beforeEach(() => {
  game = new StubGameBuilder().build();
  inMemoryGameRepository = new InMemoryGameRepository([game]);
  placeShipUsecase = new PlaceShipUsecase(inMemoryGameRepository);
  coordinatesStart = new Coordinate(5, 5);
  direction = DIRECTION.RIGHT;
});

describe('Scenario: During the start of a game, when I am the first player, I want to place my ships', () => {
  const casesDirection = [
    { coordinatesEnd: new Coordinate(6, 5), direction: DIRECTION.RIGHT },
    { coordinatesEnd: new Coordinate(4, 5), direction: DIRECTION.LEFT },
    { coordinatesEnd: new Coordinate(5, 6), direction: DIRECTION.TOP },
    { coordinatesEnd: new Coordinate(5, 4), direction: DIRECTION.BOTTOM },
  ].map((testCase) =>
    Object.assign(testCase, {
      toString: function (): DIRECTION {
        return testCase.direction;
      },
    }),
  );

  test.each(casesDirection)(
    'should be able to place a ship in the center of the grid to the direction : %s ',
    async (params) => {
      const { coordinatesEnd, direction } = params;
      const ship = new Ship([coordinatesStart, coordinatesEnd], TYPE_SHIP.SUBMARINE);
      const player = game.player1 as Player;
      const gridExpected = new GridBuilder().withShips([ship]).build();

      // Act
      await placeShipUsecase.execute(game.id, player.id, TYPE_SHIP.SUBMARINE, coordinatesStart, direction);

      const gameSaved = await inMemoryGameRepository.getById(game.id);
      const gridAfterShipPlaced = gameSaved?.player1?.grid;
      // Assert
      expect(gridExpected).toEqual(gridAfterShipPlaced);
    },
  );

  it('should not be able to place my ship if another ship already is on one of the coordinate', () => {
    // Arrange
    const ship = new Ship([coordinatesStart, new Coordinate(6, 5)], TYPE_SHIP.SUBMARINE);
    const player = new Player('id1', 'name1', new Grid([ship]));
    const game = new StubGameBuilder().withPlayer1(player).build();
    inMemoryGameRepository = new InMemoryGameRepository([game]);
    placeShipUsecase = new PlaceShipUsecase(inMemoryGameRepository);

    // Act & Assert
    return expect(
      placeShipUsecase.execute(game.id, player.id, TYPE_SHIP.SUBMARINE, coordinatesStart, direction),
    ).rejects.toThrowError('A ship is already on one of those coordinates');
  });

  it('should not be able to place a ship outside of the grid', () => {
    // Arrange
    const player = game.player1 as Player;

    // Act & Assert
    return expect(
      placeShipUsecase.execute(game.id, player.id, TYPE_SHIP.SUBMARINE, new Coordinate(10, 10), direction),
    ).rejects.toThrowError(
      'The ship cannot be placed at this coordinate and at this direction because it leaves the grid',
    );
  });

  const casesTypeShip = [
    { coordinates: [new Coordinate(5, 5), new Coordinate(6, 5)], typeShip: TYPE_SHIP.SUBMARINE },
    { coordinates: [new Coordinate(5, 5), new Coordinate(6, 5), new Coordinate(7, 5)], typeShip: TYPE_SHIP.DESTROYER },
    {
      coordinates: [new Coordinate(5, 5), new Coordinate(6, 5), new Coordinate(7, 5), new Coordinate(8, 5)],
      typeShip: TYPE_SHIP.CRUISER,
    },
    {
      coordinates: [
        new Coordinate(5, 5),
        new Coordinate(6, 5),
        new Coordinate(7, 5),
        new Coordinate(8, 5),
        new Coordinate(9, 5),
      ],
      typeShip: TYPE_SHIP.CARRIER,
    },
  ].map((testCase) =>
    Object.assign(testCase, {
      toString: function (): TYPE_SHIP {
        return testCase.typeShip;
      },
    }),
  );

  test.each(casesTypeShip)('should be able to add a ship of the type: %s', async (params) => {
    // Arrange
    const { coordinates, typeShip } = params;
    const ship = new Ship(coordinates, typeShip);
    const player = game.player1 as Player;
    const gridExpected = new GridBuilder().withShips([ship]).build();

    // Act
    await placeShipUsecase.execute(game.id, player.id, typeShip, coordinatesStart, direction);

    const gameSaved = await inMemoryGameRepository.getById(game.id);
    const gridAfterShipPlaced = gameSaved?.player1?.grid;
    // Assert
    expect(gridExpected).toEqual(gridAfterShipPlaced);
  });
});
