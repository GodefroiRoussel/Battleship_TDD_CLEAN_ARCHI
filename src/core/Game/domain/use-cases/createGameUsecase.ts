import { Game } from '../entity/game';
import { IGameRepository } from '../repository';

export class CreateGameUsecase {
  constructor(private gameRepository: IGameRepository) {}

  execute(id: string): Promise<Game> {
    return this.gameRepository.create(id);
  }
}
