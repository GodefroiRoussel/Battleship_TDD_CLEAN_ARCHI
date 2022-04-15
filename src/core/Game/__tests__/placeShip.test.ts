import { InMemoryGameRepository } from '../adapters/in-memory/InMemoryGameRepository';
import { Game } from '../domain/entity/game';
import { Player } from '../domain/entity/player';
import { Coordinate, PlaceShipUsecase } from '../domain/use-cases/placeShipUsecase';
import { StubGameBuilder } from './GameBuilder';

export class Ship {
  constructor(private coordinateStart: Coordinate, private coordinateEnd: Coordinate, private typeShip: string) {}
}

export class Grid {
  constructor(private ships: Ship[]) {}

  addShip(ship: Ship): void {
    this.ships.push(ship);
  }
}

class GridBuilder {
  private ships: Ship[];

  constructor() {
    this.ships = [];
  }

  withFirstShip(ship: Ship): GridBuilder {
    if (!this.ships?.[0]) {
      this.ships.push(ship);
      return this;
    }
    this.ships[0] = ship;
    return this;
  }

  build(): Grid {
    return new Grid(this.ships);
  }
}

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

const cases = [
  { coordinatesEnd: new Coordinate(6, 5), direction: 'RIGHT' },
  { coordinatesEnd: new Coordinate(4, 5), direction: 'LEFT' },
  { coordinatesEnd: new Coordinate(5, 6), direction: 'TOP' },
  { coordinatesEnd: new Coordinate(5, 4), direction: 'BOTTOM' },
].map((testCase) =>
  Object.assign(testCase, {
    toString: function (): string {
      return testCase.direction;
    },
  }),
);

describe('Scenario: During the start of a game, when I am the first player, I want to place my ships', () => {
  test.each(cases)(
    'should be able to place a ship in the center of the grid to the direction : %s ',
    async (params) => {
      const { coordinatesEnd, direction } = params;
      const ship = new Ship(coordinatesStart, coordinatesEnd, 'little');
      const player = game.player1 as Player;
      const gridExpected = new GridBuilder().withFirstShip(ship).build();

      // Act
      await placeShipUsecase.execute(game.id, player.id, 'little', coordinatesStart, direction);

      const gameSaved = await inMemoryGameRepository.getById(game.id);
      const gridAfterShipPlaced = gameSaved?.player1?.grid;
      // Assert
      expect(gridExpected).toEqual(gridAfterShipPlaced);
    },
  );
});
