import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { AddPlayerUsecase } from '../core/Game/domain/use-cases/addPlayerUsecase';
import { CreateGameUsecase } from '../core/Game/domain/use-cases/createGameUsecase';
import { GetShipsUsecase } from '../core/Game/domain/use-cases/getShipsUsecase';
import { PlaceShipUsecase } from '../core/Game/domain/use-cases/placeShipUsecase';
import { PlaceTemporaryCurrentShipUsecase } from '../core/Game/domain/use-cases/placeTemporaryCurrentShip';
import counterReducer from '../features/counter/counterSlice';
import gameReducer from '../features/game/gameSlice';

export type StoreProps = {
  createGameUsecase: CreateGameUsecase;
  addPlayerUsecase: AddPlayerUsecase;
  placeShipUsecase: PlaceShipUsecase;
  placeTemporaryCurrentShipUsecase: PlaceTemporaryCurrentShipUsecase;
  getShipsUsecase: GetShipsUsecase;
  preloadedState?: RootState;
};

const rootReducer = combineReducers({
  counter: counterReducer,
  game: gameReducer,
});

export const createStore = ({
  createGameUsecase,
  addPlayerUsecase,
  placeShipUsecase,
  placeTemporaryCurrentShipUsecase,
  getShipsUsecase,
  preloadedState,
}: StoreProps) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {
            createGameUsecase,
            addPlayerUsecase,
            placeShipUsecase,
            placeTemporaryCurrentShipUsecase,
            getShipsUsecase,
          },
        },
      }),
    preloadedState,
  });

  return store;
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ReturnType<typeof createStore>['dispatch'];