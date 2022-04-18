import { Coordinate } from '../entity/coordinate';
import { IGameRepository } from '../repository';

export class ShotUsecase {
  constructor(private gameRepository: IGameRepository) {}

  async execute(idGame: string, idPlayer: string, coordinateToShoot: Coordinate): Promise<void> {
    const game = await this.gameRepository.getById(idGame);
    if (!game) {
      throw new Error('Game not found');
    }

    const currentPlayerToShoot = game.player1?.id === idPlayer ? game.player1 : game.player2;
    const otherPlayer = game.player1 === currentPlayerToShoot ? game.player2 : game.player1;
    if (!currentPlayerToShoot || !otherPlayer) {
      throw new Error('A game must have players to be played');
    }
    currentPlayerToShoot.shot(coordinateToShoot, otherPlayer);
    await this.gameRepository.update(game);
  }
}
