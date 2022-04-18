import { InMemoryGameRepository } from '../adapters/in-memory/InMemoryGameRepository';
import { StubGameBuilder } from '../domain/entity/builder/gameBuilder';
import { Coordinate } from '../domain/entity/coordinate';
import { Player } from '../domain/entity/player';
import { Ship, TYPE_SHIP } from '../domain/entity/ship';
import { GetShipsUsecase } from '../domain/use-cases/getShipsUsecase';

describe('Scenario: During the game, when I am a player, I want to see my ships', () => {
  it('should return all my ships information', async () => {
    // Arrange
    const ship1 = new Ship([new Coordinate(5, 5), new Coordinate(6, 5)], TYPE_SHIP.SUBMARINE);
    const ship2 = new Ship([new Coordinate(0, 0), new Coordinate(0, 1)], TYPE_SHIP.SUBMARINE);
    const expectedShips = [ship1, ship2];
    const player = new Player('id1', 'name1', [ship1, ship2]);
    const game = new StubGameBuilder().withPlayer1(player).build();
    const inMemoryGameRepository = new InMemoryGameRepository([game]);
    const getShipsUsecase = new GetShipsUsecase(inMemoryGameRepository);
    // Act
    const ships = await getShipsUsecase.execute(game.id, player.id);

    // Assert
    expect(expectedShips).toEqual(ships);
  });
});
