import { IGameRepository } from '../repository';
import { Coordinate, invalidCoordinateError } from '../entity/coordinate';
import { DIRECTION } from '../entity/direction';
import { TYPE_SHIP } from '../entity/ship';

const shipOutsideTheGridError = new Error(
  'The ship cannot be placed at this coordinate and at this direction because it leaves the grid',
);

export class PlaceShipUsecase {
  constructor(private gameRepository: IGameRepository) {}

  async execute(
    idGame: string,
    idPlayer: string,
    typeShip: TYPE_SHIP,
    coordinatesStart: Coordinate,
    direction: DIRECTION,
  ): Promise<void> {
    const game = await this.gameRepository.getById(idGame);
    if (!game) {
      throw new Error('Game not found');
    }
    const player = game.player1?.id === idPlayer ? game.player1 : game.player2;
    if (!player) {
      throw new Error('A game must have players to be played');
    }

    try {
      player.addShip(typeShip, coordinatesStart, direction);
    } catch (error) {
      switch (error) {
        case invalidCoordinateError:
          throw shipOutsideTheGridError;
        default:
          throw new Error('A ship is already on one of those coordinates');
      }
    }
    await this.gameRepository.update(game);
    // Question : Inside out / Outside In
    // Question : Est-ce qu'on peut avoir un repository par entité ?
    // Question : Builder pattern tous les arguments ?
  }
}
