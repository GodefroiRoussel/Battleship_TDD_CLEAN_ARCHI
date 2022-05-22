import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectError,
  createGame,
  selectStepCreatingGame,
  selectIdCreatingGame,
  selectPlayer1CreatingGame,
  selectPlayer2CreatingGame,
  addPlayer,
  selectErrorCreatingGame,
  placeShip,
  placeTemporaryCurrentShip,
  selectTemporaryShip,
  selectGameCurrentGame,
} from '../features/game/gameSlice';
import { PlayerType } from '../core/Game/domain/entity/player';
import { ShipType, TYPE_SHIP } from '../core/Game/domain/entity/ship';
import { Coordinate, TYPE_COORDINATE } from '../core/Game/domain/entity/coordinate';
import { DIRECTION } from '../core/Game/domain/entity/direction';

function createNewGame(): JSX.Element {
  const errorNewGame = useAppSelector(selectError);
  const step = useAppSelector(selectStepCreatingGame);
  const idGame = useAppSelector(selectIdCreatingGame);
  const player1 = useAppSelector(selectPlayer1CreatingGame);
  const player2 = useAppSelector(selectPlayer2CreatingGame);
  const temporaryShip = useAppSelector(selectTemporaryShip);
  const errorCreatingGame = useAppSelector(selectErrorCreatingGame);
  const currentGame = useAppSelector(selectGameCurrentGame);

  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Ici on peut envoyer une action maybe ou plusieurs? Genre : ResetCreatingGame, StartCurrentGame
    if (currentGame !== undefined) {
      navigate(`/games/${currentGame._id}`);
    }
  }, [currentGame]);

  return (
    <>
      {step === 'CHOOSING_MODE' && <ChooseMode errorNewGame={errorNewGame} />}
      {step === 'ADD_PLAYER_1' && idGame !== undefined && (
        <AddPlayer idGame={idGame} numberPlayer={1} errorMsg={errorCreatingGame} />
      )}
      {step === 'PLACE_SHIPS_PLAYER_1' && idGame !== undefined && (
        <PlaceShips
          idGame={idGame}
          numberPlayer={1}
          player={player1}
          temporaryShip={temporaryShip}
          errorMsg={errorCreatingGame}
        />
      )}
      {step === 'ADD_PLAYER_2' && idGame !== undefined && (
        <AddPlayer idGame={idGame} numberPlayer={2} errorMsg={errorCreatingGame} />
      )}
      {step === 'PLACE_SHIPS_PLAYER_2' && idGame !== undefined && (
        <PlaceShips
          idGame={idGame}
          numberPlayer={2}
          player={player2}
          temporaryShip={temporaryShip}
          errorMsg={errorCreatingGame}
        />
      )}
    </>
  );
}

const ChooseMode = ({ errorNewGame }: { errorNewGame: string }): JSX.Element => {
  const dispatch = useAppDispatch();
  return (
    <>
      <div>Choose your play mode : </div>
      <button onClick={() => dispatch(createGame())}>HUMAN vs HUMAN</button>
      <div>HUMAN vs AI</div>
      <div>AI vs AI</div>
      {errorNewGame !== '' && <div>Error when creating the game : ${errorNewGame}</div>})
    </>
  );
};

const AddPlayer = ({
  idGame,
  numberPlayer,
  errorMsg,
}: {
  idGame: string;
  numberPlayer: number;
  errorMsg: string;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('toto');
  return (
    <>
      <div>Add player {numberPlayer}: </div>
      <input type="text" onChange={(event) => setName(event.target.value)} value={name}></input>
      <button
        onClick={() => {
          dispatch(addPlayer({ idGame, name }));
        }}
      >
        Add player
      </button>
      {errorMsg !== '' && <div>ERROR : {errorMsg}</div>}
    </>
  );
};

enum TYPE_COORDINATE_CELL {
  WATER = 'WATER',
  OCCUPIED = 'OCCUPIED',
  FUTURE = 'FUTURE',
  OVERLAPSE = 'OVERLAPSE',
}

const PlaceShips = ({
  idGame,
  numberPlayer,
  player,
  errorMsg,
  temporaryShip,
}: {
  idGame: string;
  numberPlayer: number;
  player: PlayerType | undefined;
  errorMsg: string;
  temporaryShip: ShipType | undefined;
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [direction, setDirection] = useState(DIRECTION.RIGHT);

  addEventListener('keydown', function (event) {
    switch (event.key) {
      case 'ArrowLeft':
        setX(x - 1);
        break;

      case 'ArrowRight':
        setX(x + 1);
        break;

      case 'ArrowUp':
        setY(y + 1);
        break;

      case 'ArrowDown':
        setY(y - 1);
        break;

      default:
        break;
    }
    console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`);
  });

  if (!player) {
    return <></>;
  }
  let typeShip: TYPE_SHIP;
  switch (player._ships.length) {
    case 1:
      typeShip = TYPE_SHIP.DESTROYER;
      break;
    case 2:
    case 3:
      typeShip = TYPE_SHIP.CRUISER;
      break;
    case 4:
      typeShip = TYPE_SHIP.CARRIER;
      break;
    default:
      typeShip = TYPE_SHIP.SUBMARINE;
      break;
  }

  useEffect(() => {
    const currentShips = player._ships;
    dispatch(placeTemporaryCurrentShip({ x, y, direction, typeShip, currentShips }));
  }, [x, y, direction, typeShip, player._ships]);

  return (
    <>
      <div> Place ships of player {numberPlayer}</div>
      <div>You have {5 - player._ships.length} ships to place</div>
      <li>
        Ships :
        {player._ships.map((ship) => (
          <ul key={ship._typeShip}>{ship._typeShip}</ul>
        ))}
      </li>
      <input type="number" value={x} onChange={(event) => setX(Number(event.target.value))} />
      <input type="number" value={y} onChange={(event) => setY(Number(event.target.value))} />
      <input
        type="radio"
        name="direction"
        id="RIGHT"
        value={DIRECTION.RIGHT}
        checked={direction === DIRECTION.RIGHT}
        onChange={() => setDirection(DIRECTION.RIGHT)}
      />
      <label htmlFor="RIGHT">RIGHT</label>
      <input
        type="radio"
        name="direction"
        id="BOTTOM"
        value={DIRECTION.BOTTOM}
        checked={direction === DIRECTION.BOTTOM}
        onChange={() => setDirection(DIRECTION.BOTTOM)}
      />
      <label htmlFor="BOTTOM">BOTTOM</label>
      <input
        type="radio"
        name="direction"
        id="LEFT"
        value={DIRECTION.LEFT}
        checked={direction === DIRECTION.LEFT}
        onChange={() => setDirection(DIRECTION.LEFT)}
      />
      <label htmlFor="LEFT">LEFT</label>
      <input
        type="radio"
        name="direction"
        id="TOP"
        value={DIRECTION.TOP}
        checked={direction === DIRECTION.TOP}
        onChange={() => setDirection(DIRECTION.TOP)}
      />
      <label htmlFor="TOP">TOP</label>
      <button
        onClick={() =>
          dispatch(
            placeShip({
              idGame,
              idPlayer: player._id,
              typeShip: typeShip,
              coordinatesStart: { x, y },
              direction: direction,
            }),
          )
        }
      >
        Add ship
      </button>
      <Grid temporaryShip={temporaryShip} ships={player._ships} />
      {errorMsg && <div>Error : {errorMsg}</div>}
    </>
  );
};

const Grid = ({ ships, temporaryShip }: { ships: ShipType[]; temporaryShip: ShipType | undefined }): JSX.Element => {
  const lines = Array(10).fill(undefined);
  return (
    <>
      <div>Grid</div>
      <div style={{ display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-around' }}>
        {lines.map((_, index) => {
          return <Line key={index} indexLine={index} temporaryShip={temporaryShip} ships={ships} />;
        })}
      </div>
    </>
  );
};

const Line = ({
  indexLine,
  temporaryShip,
  ships,
}: {
  indexLine: number;
  ships: ShipType[];
  temporaryShip: ShipType | undefined;
}): JSX.Element => {
  const columns = Array(10).fill(undefined);
  try {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        {columns.map((_, indexColumn) => {
          const currentCoordinate = new Coordinate(indexColumn, indexLine);
          const coordinatesAllShipsPlaced = ships.flatMap((ship) => ship._coordinates);
          if (isCurrentCoordinateOccupiedAndTryToPlaceCurrentShip()) {
            return <Cell key={`${indexColumn}`} typeCoordinate={TYPE_COORDINATE_CELL.OVERLAPSE} />;
          }

          if (isCurrentCoordinateOccupied()) {
            return <Cell key={`${indexColumn}`} typeCoordinate={TYPE_COORDINATE_CELL.OCCUPIED} />;
          }

          if (isCurrentCoordinateToPlaceCurrentShip()) {
            return <Cell key={`${indexColumn}`} typeCoordinate={TYPE_COORDINATE_CELL.FUTURE} />;
          }

          return <Cell key={`${indexColumn}`} typeCoordinate={TYPE_COORDINATE_CELL.WATER} />;

          function isCurrentCoordinateToPlaceCurrentShip() {
            if (!temporaryShip) {
              return false;
            }

            return (
              temporaryShip._coordinates.filter(
                (coordinateCurrentShip) =>
                  coordinateCurrentShip.x === currentCoordinate.x && coordinateCurrentShip.y === currentCoordinate.y,
              ).length > 0
            );
          }

          function isCurrentCoordinateOccupied() {
            return (
              coordinatesAllShipsPlaced.filter((coordinateAlreadyPlaced) => {
                return coordinateAlreadyPlaced.x === indexColumn && coordinateAlreadyPlaced.y === indexLine;
              }).length === 1
            );
          }

          function isCurrentCoordinateOccupiedAndTryToPlaceCurrentShip() {
            if (!temporaryShip) {
              return false;
            }

            return (
              temporaryShip._coordinates.filter(
                (coordinateCurrentShip) =>
                  coordinateCurrentShip.type === TYPE_COORDINATE.OCCUPIED &&
                  coordinateCurrentShip.x === currentCoordinate.x &&
                  coordinateCurrentShip.y === currentCoordinate.y,
              ).length > 0
            );
          }
        })}
      </div>
    );
  } catch (error) {
    throw new Error('error');
  }
};

const Cell = ({ key, typeCoordinate }: { key: string; typeCoordinate: TYPE_COORDINATE_CELL }): JSX.Element => {
  let text: string;
  let style = {
    border: 'solid',
    width: '100%',
    display: 'flex',
    flex: 1,
    backgroundColor: 'blue',
    minHeight: '5vh',
    justifyContent: 'center',
    alignItems: 'center',
  };
  switch (typeCoordinate) {
    case TYPE_COORDINATE_CELL.OCCUPIED:
      style = { ...style, backgroundColor: 'grey' };
      text = TYPE_COORDINATE_CELL.OCCUPIED;
      break;

    case TYPE_COORDINATE_CELL.FUTURE:
      style = { ...style, backgroundColor: 'green' };
      text = TYPE_COORDINATE_CELL.FUTURE;
      break;

    case TYPE_COORDINATE_CELL.OVERLAPSE:
      style = { ...style, backgroundColor: 'red' };
      text = TYPE_COORDINATE_CELL.OVERLAPSE;
      break;

    default:
      text = TYPE_COORDINATE_CELL.WATER;
      break;
  }

  return (
    <div key={key} style={style} id={key}>
      {text}
    </div>
  );
};

export default createNewGame;
