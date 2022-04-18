import { InMemoryGameRepository } from '../adapters/in-memory/InMemoryGameRepository';
import { StubGameBuilder } from '../domain/entity/builder/gameBuilder';
import { Coordinate } from '../domain/entity/coordinate';
import { Player } from '../domain/entity/player';
import { Ship, TYPE_SHIP } from '../domain/entity/ship';
import { HasWonUsecase } from '../domain/use-cases/hasWonUsecase';

describe('Scenario: After a shot, when I am a player, I want to know if I have won the game', () => {
  it('should tell that the current player won if the opponent has no more ships', async () => {
    // Arrange
    const ship1 = new Ship([new Coordinate(5, 5), new Coordinate(5, 6)], TYPE_SHIP.SUBMARINE, 0);
    const ship2 = new Ship([new Coordinate(5, 5), new Coordinate(5, 6)], TYPE_SHIP.DESTROYER, 0);

    const player2 = new Player('id2', 'name2', [ship1, ship2]);
    const game = new StubGameBuilder().withPlayer2(player2).build();
    const player = game?.player1 as Player;
    const inMemoryGameRepository = new InMemoryGameRepository([game]);
    const hasWonUsecase = new HasWonUsecase(inMemoryGameRepository);

    // Act
    const hasWon = await hasWonUsecase.execute(game.id, player.id);

    // Assert
    expect(true).toEqual(hasWon);
  });

  it('should tell that the current player has not won if the opponent has still ships alive', async () => {
    // Arrange
    const ship1 = new Ship([new Coordinate(5, 5), new Coordinate(5, 6)], TYPE_SHIP.SUBMARINE, 0);
    const ship2 = new Ship([new Coordinate(5, 5), new Coordinate(5, 6)], TYPE_SHIP.DESTROYER, 3);

    const player2 = new Player('id2', 'name2', [ship1, ship2]);
    const game = new StubGameBuilder().withPlayer2(player2).build();
    const player = game?.player1 as Player;
    const inMemoryGameRepository = new InMemoryGameRepository([game]);
    const hasWonUsecase = new HasWonUsecase(inMemoryGameRepository);

    // Act
    const hasWon = await hasWonUsecase.execute(game.id, player.id);

    // Assert
    expect(false).toEqual(hasWon);
  });
});
