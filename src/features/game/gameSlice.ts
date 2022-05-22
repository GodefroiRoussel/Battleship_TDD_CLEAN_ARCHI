import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { v4 } from 'uuid';
import { Coordinate, CoordinateType } from '../../core/Game/domain/entity/coordinate';
import { DIRECTION } from '../../core/Game/domain/entity/direction';
import { GameType, TypeGame } from '../../core/Game/domain/entity/game';
import { Player, PlayerType } from '../../core/Game/domain/entity/player';
import { ShipType, TYPE_SHIP } from '../../core/Game/domain/entity/ship';
import { AddPlayerUsecase } from '../../core/Game/domain/use-cases/addPlayerUsecase';
import { CreateGameUsecase } from '../../core/Game/domain/use-cases/createGameUsecase';
import { GetShipsUsecase } from '../../core/Game/domain/use-cases/getShipsUsecase';
import { PlaceShipUsecase } from '../../core/Game/domain/use-cases/placeShipUsecase';
import { PlaceTemporaryCurrentShipUsecase } from '../../core/Game/domain/use-cases/placeTemporaryCurrentShip';
import { RootState } from '../../store/store';

export interface GameState {
  ids: string[];
  entities: GameType[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string;
  creatingGame: {
    game: GameType | undefined;
    step: 'CHOOSING_MODE' | 'ADD_PLAYER_1' | 'ADD_PLAYER_2' | 'PLACE_SHIPS_PLAYER_1' | 'PLACE_SHIPS_PLAYER_2';
    temporaryShip: ShipType | undefined;
    error: string;
  };
  currentGame: {
    game: GameType | undefined;
    step: 'PLAYER_1_TO_SHOOT';
    error: string;
  };
}

const initialState: GameState = {
  ids: [],
  entities: [],
  loading: 'idle',
  error: '',
  creatingGame: {
    game: undefined,
    temporaryShip: undefined,
    step: 'CHOOSING_MODE',
    error: '',
  },
  currentGame: {
    game: undefined,
    step: 'PLAYER_1_TO_SHOOT',
    error: '',
  },
};

export const gameSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createGame.fulfilled, (state, action) => {
      state.creatingGame.game = action.payload;
      state.creatingGame.step = 'ADD_PLAYER_1';
    });
    builder.addCase(createGame.rejected, (state, action) => {
      state.error = action.error as string;
      state.loading = 'failed';
    });
    builder.addCase(createGame.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(addPlayer.fulfilled, (state, action) => {
      state.creatingGame.game = action.payload;
      if (action.payload._player2 === undefined) {
        state.creatingGame.step = 'PLACE_SHIPS_PLAYER_1';
      } else {
        state.creatingGame.step = 'PLACE_SHIPS_PLAYER_2';
      }
    });
    builder.addCase(addPlayer.rejected, (state, action) => {
      state.creatingGame.error = action.error as string;
    });
    builder.addCase(placeShip.fulfilled, (state, action) => {
      state.creatingGame.error = '';
      if (state.creatingGame.game?._player1 && state.creatingGame.game._player2 === undefined) {
        if (state.creatingGame.game._player1._ships.length <= 5) {
          state.creatingGame.game._player1._ships = action.payload.ships;
        }
        if (state.creatingGame.game._player1._ships.length === 5) {
          state.creatingGame.step = 'ADD_PLAYER_2';
        }
      }

      if (state.creatingGame.game?._player2) {
        if (state.creatingGame.game._player2._ships.length <= 5) {
          state.creatingGame.game._player2._ships = action.payload.ships;
        }
        if (state.creatingGame.game._player2._ships.length === 5) {
          const gameReady: GameType = {
            _id: state.creatingGame.game._id,
            _type: state.creatingGame.game._type,
            _player1: state.creatingGame.game._player1,
            _player2: state.creatingGame.game._player2,
          };

          // Init the current game
          state.ids.push(gameReady._id);
          state.entities.push(gameReady);
          state.loading = 'succeeded';
          state.currentGame.game = gameReady;

          // Reset the creating game
          state.creatingGame.error = '';
          state.creatingGame.game = {
            _id: '',
            _type: TypeGame.Human_vs_Human,
            _player1: undefined,
            _player2: undefined,
          };
          state.creatingGame.step = 'CHOOSING_MODE';
          state.creatingGame.temporaryShip = undefined;
        }
      }
    });
    builder.addCase(placeShip.rejected, (state, action) => {
      state.creatingGame.error = action.error.message || '';
    });
    builder.addCase(placeTemporaryCurrentShip.fulfilled, (state, action) => {
      const ship: ShipType = {
        _coordinates: action.payload,
        _typeShip: action.meta.arg.typeShip,
        life: action.payload?.length,
      };
      state.creatingGame.temporaryShip = ship;
      state.creatingGame.error = '';
    });
    builder.addCase(placeTemporaryCurrentShip.rejected, (state, action) => {
      state.creatingGame.error = action.error.message || '';
    });
  },
});

export const createGame = createAsyncThunk<GameType, void, { extra: { createGameUsecase: CreateGameUsecase } }>(
  'game/newGame',
  async (_, { extra: { createGameUsecase } }) => {
    const id = v4();
    try {
      const newGame = await createGameUsecase.execute(id);
      console.log('New game : ', newGame);
      // TODO : Ne plus renvoyer un objet depuis un usecase mais le toJSON, adpater les tests
      return newGame.toJSON();
    } catch (error) {
      throw new Error('error');
    }
  },
);

export const addPlayer = createAsyncThunk<
  GameType,
  { idGame: string; name: string },
  { extra: { addPlayerUsecase: AddPlayerUsecase } }
>('game/addPlayer', async ({ idGame, name }, { extra: { addPlayerUsecase } }) => {
  const id = v4();
  const player = new Player(id, name);
  try {
    const game = await addPlayerUsecase.execute(idGame, player);
    return game.toJSON();
  } catch (error: unknown) {
    throw error;
  }
});

export const placeShip = createAsyncThunk<
  { idPlayer: string; ships: ShipType[] },
  { idGame: string; idPlayer: string; typeShip: TYPE_SHIP; coordinatesStart: CoordinateType; direction: DIRECTION },
  { extra: { placeShipUsecase: PlaceShipUsecase; getShipsUsecase: GetShipsUsecase } }
>(
  'game/placeShip',
  async (
    { idGame, idPlayer, typeShip, coordinatesStart, direction },
    { extra: { placeShipUsecase, getShipsUsecase } },
  ) => {
    try {
      const coordinate = new Coordinate(coordinatesStart.x, coordinatesStart.y);
      await placeShipUsecase.execute(idGame, idPlayer, typeShip, coordinate, direction);
      const ships = await getShipsUsecase.execute(idGame, idPlayer);
      const shipsType = ships.map((ship) => ship.toJSON());
      return {
        idPlayer,
        ships: shipsType,
      };
    } catch (error: unknown) {
      throw error;
    }
  },
);

export const placeTemporaryCurrentShip = createAsyncThunk<
  CoordinateType[],
  { typeShip: TYPE_SHIP; x: number; y: number; direction: DIRECTION; currentShips: ShipType[] },
  { extra: { placeTemporaryCurrentShipUsecase: PlaceTemporaryCurrentShipUsecase } }
>(
  'game/placeTemporaryCurrentShip',
  ({ typeShip, x, y, direction, currentShips }, { extra: { placeTemporaryCurrentShipUsecase } }) => {
    try {
      return placeTemporaryCurrentShipUsecase.execute(typeShip, x, y, direction, currentShips);
    } catch (error: unknown) {
      throw error;
    }
  },
);

export const selectError = (state: RootState): string => state.game.error;

export const selectStepCreatingGame = (state: RootState): string => state.game.creatingGame.step;
export const selectIdCreatingGame = (state: RootState): string | undefined => state.game.creatingGame.game?._id;
export const selectPlayer1CreatingGame = (state: RootState): PlayerType | undefined =>
  state.game.creatingGame.game?._player1;
export const selectPlayer2CreatingGame = (state: RootState): PlayerType | undefined =>
  state.game.creatingGame.game?._player2;
export const selectErrorCreatingGame = (state: RootState): string => state.game.creatingGame.error;
export const selectTemporaryShip = (state: RootState): ShipType | undefined => state.game.creatingGame.temporaryShip;

export const selectCurrentGame = (
  state: RootState,
): { game: GameType | undefined; error: string; step: 'PLAYER_1_TO_SHOOT' } => state.game.currentGame;
export const selectGameCurrentGame = (state: RootState): GameType | undefined => state.game.currentGame.game;
export const selectStepCurrentGame = (state: RootState): string => state.game.currentGame.step;
export const selectErrorCurrentGame = (state: RootState): string => state.game.currentGame.error;

export default gameSlice.reducer;
