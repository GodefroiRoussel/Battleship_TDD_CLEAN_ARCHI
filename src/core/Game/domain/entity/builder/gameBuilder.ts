import { Game, TypeGame } from '../game';
import { Player } from '../player';
import { Grid } from '../grid';

export class GameBuilder {
  protected id: string;
  protected type: TypeGame;
  protected player1?: Player;
  protected player2?: Player;

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

  public withPlayer1(player: Player): GameBuilder {
    this.player1 = player;
    return this;
  }

  public withPlayer2(player: Player): GameBuilder {
    this.player2 = player;
    return this;
  }

  public build(): Game {
    return new Game(this.id, this.type, this.player1, this.player2);
  }
}

export class StubGameBuilder extends GameBuilder {
  constructor() {
    super();
    this.id = 'id';
    this.player1 = new Player('id1', 'name1', new Grid([]));
    this.player2 = new Player('id2', 'name2', new Grid([]));
  }
}
