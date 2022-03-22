import { Game } from '../entity/game';

export interface IGameRepository {
  create(id: string): Promise<Game>;
  getById(idGame: string): Promise<Game | undefined>;
  update(game: Game): Promise<Game>;
}
