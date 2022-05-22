import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import { createStore, RootState } from './store/store';
import { Provider } from 'react-redux';
import NewGamePage from './pages/createNewGame';
import { Counter } from './features/counter/counter';
import reportWebVitals from './reportWebVitals';
import CssBaseline from '@mui/material/CssBaseline';
import { InMemoryGameRepository } from './core/Game/adapters/in-memory/InMemoryGameRepository';
import { CreateGameUsecase } from './core/Game/domain/use-cases/createGameUsecase';
import { AddPlayerUsecase } from './core/Game/domain/use-cases/addPlayerUsecase';
import { PlaceShipUsecase } from './core/Game/domain/use-cases/placeShipUsecase';
import { GetShipsUsecase } from './core/Game/domain/use-cases/getShipsUsecase';
import { PlaceTemporaryCurrentShipUsecase } from './core/Game/domain/use-cases/placeTemporaryCurrentShip';
import { Game, TypeGame } from './core/Game/domain/entity/game';
import { Ship, TYPE_SHIP } from './core/Game/domain/entity/ship';
import { Player } from './core/Game/domain/entity/player';
import { Coordinate } from './core/Game/domain/entity/coordinate';
import { DIRECTION } from './core/Game/domain/entity/direction';

const ships: Ship[] = [
  new Ship([new Coordinate(0, 0), new Coordinate(1, 0)], TYPE_SHIP.SUBMARINE, 2),
  Ship.create(new Coordinate(0, 1), DIRECTION.RIGHT, TYPE_SHIP.DESTROYER),
  Ship.create(new Coordinate(0, 2), DIRECTION.RIGHT, TYPE_SHIP.CRUISER),
  Ship.create(new Coordinate(0, 3), DIRECTION.RIGHT, TYPE_SHIP.CRUISER),
  Ship.create(new Coordinate(0, 4), DIRECTION.RIGHT, TYPE_SHIP.CARRIER),
];

const shipsWith1Missing: Ship[] = [
  new Ship([new Coordinate(0, 0), new Coordinate(1, 0)], TYPE_SHIP.SUBMARINE, 2),
  Ship.create(new Coordinate(0, 1), DIRECTION.RIGHT, TYPE_SHIP.DESTROYER),
  Ship.create(new Coordinate(0, 2), DIRECTION.RIGHT, TYPE_SHIP.CRUISER),
  Ship.create(new Coordinate(0, 3), DIRECTION.RIGHT, TYPE_SHIP.CRUISER),
];

const inMemoryGameRepository = new InMemoryGameRepository([
  new Game(
    'id1',
    TypeGame.Human_vs_Human,
    new Player('id1', 'TOTO', ships),
    new Player('id2', 'TATA', shipsWith1Missing),
  ),
]);

const preloadedState: RootState = {
  game: {
    ids: [],
    entities: [],
    loading: 'idle',
    error: '',
    currentGame: {
      error: '',
      game: undefined,
      step: 'PLAYER_1_TO_SHOOT',
    },
    creatingGame: {
      step: 'PLACE_SHIPS_PLAYER_2',
      game: {
        _id: 'id1',
        _type: TypeGame.Human_vs_Human,
        _player1: {
          _id: 'id1',
          _listCoordinatesShot: [],
          _name: 'TOTO',
          _ships: ships.map((ship) => ship.toJSON()),
        },
        _player2: {
          _id: 'id2',
          _listCoordinatesShot: [],
          _name: 'TATA',
          _ships: shipsWith1Missing.map((ship) => ship.toJSON()),
        },
      },
      temporaryShip: undefined,
      error: '',
    },
  },
  counter: {
    entities: [],
    loading: 'idle',
    value: 5,
  },
};

const store = createStore({
  createGameUsecase: new CreateGameUsecase(inMemoryGameRepository),
  addPlayerUsecase: new AddPlayerUsecase(inMemoryGameRepository),
  placeShipUsecase: new PlaceShipUsecase(inMemoryGameRepository),
  placeTemporaryCurrentShipUsecase: new PlaceTemporaryCurrentShipUsecase(),
  getShipsUsecase: new GetShipsUsecase(inMemoryGameRepository),
  preloadedState,
});

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="new-game" element={<NewGamePage />} />
          <Route path="counter" element={<Counter />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
