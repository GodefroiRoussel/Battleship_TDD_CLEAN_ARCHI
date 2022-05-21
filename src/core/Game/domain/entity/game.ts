import { Player, PlayerType } from './player';

export enum TypeGame {
  Human_vs_Human = 'Human vs Human',
  Human_vs_AI_easy = 'Human vs AI easy', // should not be there yet
}

export type GameType = {
  _id: string;
  _type: TypeGame;
  _player1?: PlayerType;
  _player2?: PlayerType;
};

export class Game {
  constructor(private _id: string, private _type: TypeGame, private _player1?: Player, private _player2?: Player) {}

  get id(): string {
    return this._id;
  }

  get type(): string {
    return this._type;
  }

  get player1(): Player | undefined {
    return this._player1;
  }

  get player2(): Player | undefined {
    return this._player2;
  }

  public addPlayer1(player: Player): Game {
    if (!this._player1) {
      this._player1 = player;
    }
    return this;
  }

  public addPlayer2(player: Player): Game {
    if (!this._player2) {
      this._player2 = player;
    }
    return this;
  }

  public toJSON(): GameType {
    return {
      _id: this._id,
      _type: this._type,
      _player1: this._player1?.toJSON(),
      _player2: this._player2?.toJSON(),
    };
  }
}
