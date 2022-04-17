import { cloneDeep } from 'lodash';
import { Game, TypeGame } from '../../domain/entity/game';
import { IGameRepository } from '../../domain/repository';

export class InMemoryGameRepository implements IGameRepository {
  constructor(private games: Game[] = []) {}

  create(id: string): Promise<Game> {
    const newGame = new Game(id, TypeGame.Human_vs_Human);
    this.games.push(newGame);
    return Promise.resolve(newGame);
  }

  getById(idGame: string): Promise<Game | undefined> {
    const game = this.games.filter((game) => game.id === idGame)?.[0];
    return Promise.resolve(cloneDeep(game));
  }

  update(game: Game): Promise<Game> {
    const indexGameToUpdate = this.games.findIndex((gameSaved) => gameSaved.id === game.id);
    if (indexGameToUpdate === undefined) {
      return Promise.reject('Game to update not found');
    }
    this.games[indexGameToUpdate] = game;
    return Promise.resolve(game);
  }
}
