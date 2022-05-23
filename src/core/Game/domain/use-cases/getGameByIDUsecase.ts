import { Game } from '../entity/game';
import { IGameRepository } from '../repository';

export class GetGameByIDUsecase {
  constructor(private gameRepository: IGameRepository) {}

  async execute(id: string): Promise<Game> {
    const game = await this.gameRepository.getById(id);
    if (!game) {
      throw new Error('Game is not existing');
    }

    return game;
  }
}
