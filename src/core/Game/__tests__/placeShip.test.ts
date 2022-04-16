import { InMemoryGameRepository } from '../adapters/in-memory/InMemoryGameRepository';
import { Game } from '../domain/entity/game';
import { Player } from '../domain/entity/player';
import { PlaceShipUsecase } from '../domain/use-cases/placeShipUsecase';
import { Coordinate } from '../domain/entity/coordinate';
import { StubGameBuilder } from '../domain/entity/builder/gameBuilder';
import { Ship } from '../domain/entity/ship';
import { GridBuilder } from '../domain/entity/builder/gridBuilder';
import { Grid } from '../domain/entity/grid';
import { DIRECTION } from '../domain/entity/direction';

let game: Game;
let inMemoryGameRepository: InMemoryGameRepository;
let placeShipUsecase: PlaceShipUsecase;
let coordinatesStart: Coordinate;

beforeEach(() => {
  game = new StubGameBuilder().build();
  inMemoryGameRepository = new InMemoryGameRepository([game]);
  placeShipUsecase = new PlaceShipUsecase(inMemoryGameRepository);
  coordinatesStart = new Coordinate(5, 5);
});

describe('Scenario: During the start of a game, when I am the first player, I want to place my ships', () => {
  const cases = [
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

  test.each(cases)(
    'should be able to place a ship in the center of the grid to the direction : %s ',
    async (params) => {
      const { coordinatesEnd, direction } = params;
      const ship = new Ship(coordinatesStart, coordinatesEnd, 'little');
      const player = game.player1 as Player;
      const gridExpected = new GridBuilder().withShips([ship]).build();

      // Act
      await placeShipUsecase.execute(game.id, player.id, 'little', coordinatesStart, direction);

      const gameSaved = await inMemoryGameRepository.getById(game.id);
      const gridAfterShipPlaced = gameSaved?.player1?.grid;
      // Assert
      expect(gridExpected).toEqual(gridAfterShipPlaced);
    },
  );

  it('should no be able to place my ship if another ship already is on one of the coordinate', () => {
    // Arrange
    const ship = new Ship(coordinatesStart, new Coordinate(6, 5), 'little');
    const player = new Player('id1', 'name1', new Grid([ship]));
    const game = new StubGameBuilder().withPlayer1(player).build();
    inMemoryGameRepository = new InMemoryGameRepository([game]);
    placeShipUsecase = new PlaceShipUsecase(inMemoryGameRepository);
    const direction = DIRECTION.RIGHT;

    // Act & Assert
    expect(placeShipUsecase.execute(game.id, player.id, 'little', coordinatesStart, direction)).rejects.toThrowError(
      'A ship is already on one of those coordinates',
    );
  });
});
