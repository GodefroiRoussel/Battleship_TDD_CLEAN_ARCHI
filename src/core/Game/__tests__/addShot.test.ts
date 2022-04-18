import { InMemoryGameRepository } from '../adapters/in-memory/InMemoryGameRepository';
import { StubGameBuilder } from '../domain/entity/builder/gameBuilder';
import { Coordinate, CoordinateShot, TYPE_COORDINATE } from '../domain/entity/coordinate';
import { Game } from '../domain/entity/game';
import { Player } from '../domain/entity/player';
import { Ship, TYPE_SHIP } from '../domain/entity/ship';
import { ShotUsecase } from '../domain/use-cases/shotUsecase';

let game: Game;
let player: Player;
let coordinateToShoot: Coordinate;
let coordinateShot: CoordinateShot;
let inMemoryGameRepository: InMemoryGameRepository;
let shotUsecase: ShotUsecase;

beforeEach(() => {
  game = new StubGameBuilder().build();
  player = game.player1 as Player;
  coordinateToShoot = new Coordinate(5, 5);
  coordinateShot = new CoordinateShot(5, 5, TYPE_COORDINATE.WATER);
  inMemoryGameRepository = new InMemoryGameRepository([game]);
  shotUsecase = new ShotUsecase(inMemoryGameRepository);
});

describe('Scenario: During a game, when I am a player, I want to shoot on coordinates', () => {
  it('should shoot on a coordinate without ship', async () => {
    // Act
    await shotUsecase.execute(game.id, player.id, coordinateToShoot);

    // Assert
    const gameAfterShot = await inMemoryGameRepository.getById(game.id);
    expect([coordinateShot]).toEqual(gameAfterShot?.player1?.listCoordinatesShot);
  });

  it('should not be able to shot on a coordinate already shot by the same player', async () => {
    // Arrange
    const player = new Player('id', 'name', [], [coordinateShot]);
    const game = new StubGameBuilder().withPlayer1(player).build();

    const inMemoryGameRepository = new InMemoryGameRepository([game]);
    const shotUsecase = new ShotUsecase(inMemoryGameRepository);

    // Act && Assert
    return expect(shotUsecase.execute(game.id, player.id, coordinateToShoot)).rejects.toThrowError(
      'This coordinate has already been shot',
    );
  });

  it('should be able to shot on a coordinate already shot by another player', async () => {
    // Arrange
    const player = new Player('id', 'name', [], [coordinateShot]);
    const game = new StubGameBuilder().withPlayer1(player).build();
    const player2 = game.player2 as Player;

    const inMemoryGameRepository = new InMemoryGameRepository([game]);
    const shotUsecase = new ShotUsecase(inMemoryGameRepository);
    // Act
    await shotUsecase.execute(game.id, player2.id, coordinateToShoot);

    // Assert
    const gameAfterShot = await inMemoryGameRepository.getById(game.id);
    expect([coordinateShot]).toEqual(gameAfterShot?.player2?.listCoordinatesShot);
  });

  it('should shoot a coordinate where an ennemy ship is', async () => {
    // Arrange
    const ship = new Ship([new Coordinate(5, 5), new Coordinate(5, 6)], TYPE_SHIP.SUBMARINE);
    const player2 = new Player('id2', 'name2', [ship]);
    const game = new StubGameBuilder().withPlayer2(player2).build();
    const player1 = game.player1 as Player;
    const inMemoryGameRepository = new InMemoryGameRepository([game]);
    const shotUsecase = new ShotUsecase(inMemoryGameRepository);
    const expectedCoordinateShot = new CoordinateShot(5, 5, TYPE_COORDINATE.TOUCHED);
    const expectedLifeShip = 1;

    // Act
    await shotUsecase.execute(game.id, player1.id, coordinateToShoot);

    // Assert
    const gameAfterShot = await inMemoryGameRepository.getById(game.id);
    expect(expectedCoordinateShot).toEqual(gameAfterShot?.player1?.listCoordinatesShot[0]);
    expect(expectedLifeShip).toEqual(gameAfterShot?.player2?.ships[0].life);
  });
});
