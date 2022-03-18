export enum TypeGame {
  Human_vs_Human = 'Human vs Human',
  Human_vs_AI_easy = 'Human vs AI easy', // should not be there yet
}

export class Game {
  constructor(private _id: string, private _type: TypeGame) {}

  get id(): string {
    return this._id;
  }

  get type(): string {
    return this._type;
  }
}
