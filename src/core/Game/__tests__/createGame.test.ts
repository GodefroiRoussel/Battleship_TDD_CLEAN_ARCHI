import { Game, TypeGame } from '../domain/entity/game';
import { InMemoryGameRepository } from '../adapters/in-memory/InMemoryGameRepository';
import { CreateGameUsecase } from '../domain/use-cases/createGameUsecase';

describe('Create Game tests', () => {
  describe('Scenario: Create a game', () => {
    const inMemoryGameRepository = new InMemoryGameRepository([]);

    it('should create the game in the mode human vs human by default', async () => {
      const gameExpected = new Game('id', TypeGame.Human_vs_Human);

      const createGameUsecase = new CreateGameUsecase(inMemoryGameRepository);
      const game = await createGameUsecase.execute('id');
      expect(gameExpected).toEqual(game);
    });
  });
});
