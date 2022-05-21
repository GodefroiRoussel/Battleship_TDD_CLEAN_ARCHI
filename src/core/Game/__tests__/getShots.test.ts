import { InMemoryGameRepository } from '../adapters/in-memory/InMemoryGameRepository';
import { StubGameBuilder } from '../domain/entity/builder/gameBuilder';
import { Coordinate, TYPE_COORDINATE } from '../domain/entity/coordinate';
import { Player } from '../domain/entity/player';
import { GetShotsUsecase } from '../domain/use-cases/getShotsUsecase';

describe('Scenario: During the game, when I am a player, I want to see my previously shots', () => {
  it('should return all my shots information', async () => {
    // Arrange
    const waterShot = new Coordinate(5, 5, TYPE_COORDINATE.WATER);
    const touchedShot = new Coordinate(5, 6, TYPE_COORDINATE.TOUCHED);
    const expectedShots = [waterShot, touchedShot];
    const player = new Player('id1', 'name1', [], [waterShot, touchedShot]);
    const game = new StubGameBuilder().withPlayer1(player).build();
    const inMemoryGameRepository = new InMemoryGameRepository([game]);
    const getShotsUsecase = new GetShotsUsecase(inMemoryGameRepository);

    // Act
    const shots = await getShotsUsecase.execute(game.id, player.id);

    // Assert
    expect(expectedShots).toEqual(shots);
  });
});
