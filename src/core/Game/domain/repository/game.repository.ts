import { Game } from '../entity/game';

export interface IGameRepository {
  create(id: string): Promise<Game>;
}
