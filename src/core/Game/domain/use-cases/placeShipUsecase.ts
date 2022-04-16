import { IGameRepository } from '../repository';
import { Coordinate } from '../entity/coordinate';
import { DIRECTION } from '../entity/direction';

export class PlaceShipUsecase {
  constructor(private gameRepository: IGameRepository) {}

  async execute(
    idGame: string,
    idPlayer: string,
    typeShip: string,
    coordinatesStart: Coordinate,
    direction: DIRECTION,
  ): Promise<void> {
    const game = await this.gameRepository.getById(idGame);
    if (!game) {
      throw new Error('Game not found');
    }
    const player = game.player1?.id === idPlayer ? game.player1 : game.player2;
    if (!player) {
      throw new Error('It will never happen');
    }

    try {
      player.addShip(typeShip, coordinatesStart, direction);
    } catch (error) {
      throw new Error('A ship is already on one of those coordinates');
    }
    await this.gameRepository.update(game);
    // Question : Inside out / Outside In
    // Question : Est-ce qu'on peut avoir un repository par entité ?
    // Question : Builder pattern tous les arguments ?
  }
}
