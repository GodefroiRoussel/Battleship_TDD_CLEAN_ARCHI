import { useCallback, useEffect, useState } from 'react';
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
import { DIRECTION } from '../core/Game/domain/entity/direction';
import { Grid } from '../components/Grid';

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

  if (!player) {
    return <></>;
  }

  const placeShipAction = () => {
    dispatch(
      placeShip({
        idGame,
        idPlayer: player._id,
        typeShip: typeShip,
        coordinatesStart: { x, y },
        direction: direction,
      }),
    );
  };

  const handleUserKeyPress = useCallback(
    (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          setX((x) => x - 1);
          break;

        case 'ArrowRight':
          setX((x) => x + 1);
          break;

        case 'ArrowUp':
          setY((y) => y + 1);
          break;

        case 'ArrowDown':
          setY((y) => y - 1);
          break;

        case 'Enter':
          placeShipAction();
          break;

        default:
          break;
      }
    },
    [x, y, player],
  );

  useEffect(() => {
    addEventListener('keydown', handleUserKeyPress);
    return () => {
      removeEventListener('keydown', handleUserKeyPress);
    };
  }, [x, y, player]);

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
      <button onClick={() => placeShipAction()}>Add ship</button>
      <Grid temporaryShip={temporaryShip} ships={player._ships} />
      {errorMsg && <div>Error : {errorMsg}</div>}
    </>
  );
};

export default createNewGame;
