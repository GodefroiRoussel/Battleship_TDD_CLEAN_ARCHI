import { Coordinate } from '../entity/coordinate';
import { IGameRepository } from '../repository';

export class GetShotsUsecase {
  constructor(private gameRepository: IGameRepository) {}

  async execute(idGame: string, idPlayer: string): Promise<Coordinate[]> {
    const game = await this.gameRepository.getById(idGame);
    if (!game) {
      throw new Error('Game not found');
    }

    const player = game.player1?.id === idPlayer ? game.player1 : game.player2;
    if (!player) {
      throw new Error('A game must have players to be played');
    }
    return Promise.resolve(player.listCoordinatesShot);
  }
}
