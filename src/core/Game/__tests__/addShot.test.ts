import { InMemoryGameRepository } from '../adapters/in-memory/InMemoryGameRepository';
import { StubGameBuilder } from '../domain/entity/builder/gameBuilder';
import { Coordinate } from '../domain/entity/coordinate';
import { Player } from '../domain/entity/player';
import { IGameRepository } from '../domain/repository';

class ShotUsecase {
  constructor(private gameRepository: IGameRepository) {}

  async execute(idGame: string, idPlayer: string, coordinateToShoot: Coordinate) {
    const game = await this.gameRepository.getById(idGame);
    if (!game) {
      throw new Error('Game not found');
    }

    const player = game.player1?.id === idPlayer ? game.player1 : game.player2;
    if (!player) {
      throw new Error('A game must have players to be played');
    }

    player.shot(coordinateToShoot);
    await this.gameRepository.update(game);
  }
}

describe('Scenario: During a game, when I am a player, I want to shoot on coordinates', () => {
  it('should shoot on a coordinate without ship', async () => {
    // Arrange
    const game = new StubGameBuilder().build();
    const player = game.player1 as Player;
    const coordinateToShoot = new Coordinate(5, 5);

    const inMemoryGameRepository = new InMemoryGameRepository([game]);
    const shotUsecase = new ShotUsecase(inMemoryGameRepository);

    // Act
    await shotUsecase.execute(game.id, player.id, coordinateToShoot);

    const gameAfterShot = await inMemoryGameRepository.getById(game.id);
    // Assert
    expect([coordinateToShoot]).toEqual(gameAfterShot?.player1?.listCoordinatesShot);
  });
});
