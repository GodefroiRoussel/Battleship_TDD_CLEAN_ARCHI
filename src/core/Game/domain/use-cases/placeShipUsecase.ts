import { IGameRepository } from '../repository';

export class Coordinate {
  constructor(public readonly x: number, public readonly y: number) {}

  next(direction: string): Coordinate {
    switch (direction) {
      case 'BOTTOM':
        return new Coordinate(this.x, this.y - 1);

      case 'TOP':
        return new Coordinate(this.x, this.y + 1);

      case 'LEFT':
        return new Coordinate(this.x + -1, this.y);

      default:
        return new Coordinate(this.x + 1, this.y);
    }
  }
}

export class PlaceShipUsecase {
  constructor(private gameRepository: IGameRepository) {}

  async execute(
    idGame: string,
    idPlayer: string,
    typeShip: string,
    coordinatesStart: Coordinate,
    direction: string,
  ): Promise<void> {
    const game = await this.gameRepository.getById(idGame);
    if (!game) {
      throw new Error('Game not found');
    }
    const player = game.player1?.id === idPlayer ? game.player1 : game.player2;
    if (!player) {
      throw new Error('It will never happen');
    }
    player.addShip(typeShip, coordinatesStart, direction);
    await this.gameRepository.update(game);
    // Question : Inside out / Outside In
    // Question : Est-ce qu'on peut avoir un repository par entité ?
    // Question : Builder pattern tous les arguments ?
    // Question : Comment fonctionne le presenter ? Comment faire pour un usecase un peu complexe ? Pour la logique du placer exactement 5 bateaux
  }
}
