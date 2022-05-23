import { InMemoryGameRepository } from '../adapters/in-memory/InMemoryGameRepository';
import { Game, TypeGame } from '../domain/entity/game';
import { GetGameByIDUsecase } from '../domain/use-cases/getGameByIDUsecase';

describe('Retrieving a game by its id', () => {
  it('can retrieve an existing game', async () => {
    // Arrange
    const gameExpected = new Game('id', TypeGame.Human_vs_Human);
    const inMemoryGameRepository = new InMemoryGameRepository([gameExpected]);
    const getGameByIDUsecase = new GetGameByIDUsecase(inMemoryGameRepository);
    // Act
    const game = await getGameByIDUsecase.execute('id');
    // Assert
    expect(gameExpected).toEqual(game);
  });

  it('cannot retrieve a non existing game', () => {
    // Arrange
    const inMemoryGameRepository = new InMemoryGameRepository([]);
    const getGameByIDUsecase = new GetGameByIDUsecase(inMemoryGameRepository);
    // Act & Assert
    return expect(getGameByIDUsecase.execute('notAnID')).rejects.toThrowError('Game is not existing');
  });
});
