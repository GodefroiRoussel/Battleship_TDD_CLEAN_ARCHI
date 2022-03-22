import { InMemoryGameRepository } from '../adapters/in-memory/InMemoryGameRepository';
import { Game, TypeGame } from '../domain/entity/game';
import { AddPlayerUsecase } from '../domain/use-cases/addPlayerUsecase';
import { Player } from '../domain/entity/player';

class GameBuilder {
  private id: string;
  private type: TypeGame;
  private player1?: Player;
  private player2?: Player;

  constructor() {
    this.id = '';
    this.type = TypeGame.Human_vs_Human;
    this.player1 = undefined;
    this.player2 = undefined;
  }

  public withID(id: string): GameBuilder {
    this.id = id;
    return this;
  }

  public withPlayer1(player: Player) {
    this.player1 = player;
    return this;
  }

  public withPlayer2(player: Player) {
    this.player2 = player;
    return this;
  }

  public build(): Game {
    return new Game(this.id, this.type, this.player1, this.player2);
  }
}

describe('Add a player to a game', () => {
  it('Should be able to add one player to a game', async () => {
    const game = new GameBuilder().withID('id').build();
    const inMemoryGameRepository = new InMemoryGameRepository([game]);
    const addPlayerUsecase = new AddPlayerUsecase(inMemoryGameRepository);
    const playerToAdd = new Player('id', 'name');
    const gameExpectedWithOnePLayer = new GameBuilder().withID('id').withPlayer1(playerToAdd).build();

    const gameAfterAddPlayer = await addPlayerUsecase.execute('id', playerToAdd);

    expect(gameExpectedWithOnePLayer).toEqual(gameAfterAddPlayer);
    expect(gameExpectedWithOnePLayer).toEqual(await inMemoryGameRepository.getById('id'));
  });

  it('Should be able to add a second player to a game', async () => {
    const firstPlayer = new Player('id1', 'name1');
    const game = new GameBuilder().withID('id').withPlayer1(firstPlayer).build();
    const inMemoryGameRepository = new InMemoryGameRepository([game]);
    const addPlayerUsecase = new AddPlayerUsecase(inMemoryGameRepository);
    const playerToAdd = new Player('id2', 'name2');
    const gameExpectedWithTwoPLayers = new GameBuilder()
      .withID('id')
      .withPlayer1(firstPlayer)
      .withPlayer2(playerToAdd)
      .build();

    const gameAfterAddPlayer = await addPlayerUsecase.execute('id', playerToAdd);

    expect(gameExpectedWithTwoPLayers).toEqual(gameAfterAddPlayer);
    expect(gameExpectedWithTwoPLayers).toEqual(await inMemoryGameRepository.getById('id'));
  });

  it('should not be able to add a third player to a game', async () => {
    const firstPlayer = new Player('id1', 'name1');
    const secondPlayer = new Player('id2', 'name2');
    const game = new GameBuilder().withID('id').withPlayer1(firstPlayer).withPlayer2(secondPlayer).build();
    const inMemoryGameRepository = new InMemoryGameRepository([game]);
    const addPlayerUsecase = new AddPlayerUsecase(inMemoryGameRepository);
    const playerToAdd = new Player('id3', 'name3');

    expect(addPlayerUsecase.execute('id', playerToAdd)).rejects.toThrowError('Cannot add a third player to this game');
  });
});
