import { Game, TypeGame } from '../../domain/entity/game';
import { IGameRepository } from '../../domain/repository';

export class InMemoryGameRepository implements IGameRepository {
  constructor(private games: Game[] = []) {}

  create(id: string): Promise<Game> {
    const newGame = new Game(id, TypeGame.Human_vs_Human);
    this.games.push(newGame);
    return Promise.resolve(newGame);
  }
}
