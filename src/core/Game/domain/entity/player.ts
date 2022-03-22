export class Player {
  constructor(private _id: string, private _name: string) {}

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }
}
