import { Player } from '../entity/player';
import { Game } from '../entity/game';
import { IGameRepository } from '../repository';

export class AddPlayerUsecase {
  constructor(private gameRepository: IGameRepository) {}

  async execute(idGame: string, player: Player): Promise<Game> {
    const game = await this.gameRepository.getById(idGame);
    if (!game) {
      throw new Error('Game not found');
    }

    if (!game.player1) {
      game.addPlayer1(player);
    } else if (!game.player2) {
      game.addPlayer2(player);
    }

    await this.gameRepository.update(game);
    return game;
  }
}
