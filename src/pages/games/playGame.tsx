import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '../../components/Grid';
import { GameType } from '../../core/Game/domain/entity/game';
import { PlayerType } from '../../core/Game/domain/entity/player';
import {
  GAME_STEPS,
  getGameByID,
  hasWon,
  selectErrorCurrentGame,
  selectGameCurrentGame,
  selectStepCurrentGame,
  shot,
} from '../../features/game/gameSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

const Winner = ({ player, game }: { player: PlayerType; game: GameType }) => {
  let ennemyPlayer: PlayerType;
  if (player._id === game._player1?._id) {
    ennemyPlayer = game._player2 as PlayerType;
  } else {
    ennemyPlayer = game._player1 as PlayerType;
  }

  return (
    <>
      <h1>The winner is : {player._name} !</h1>
      <span>Ennemy grid</span>
      <Grid coordinatesShot={player._listCoordinatesShot} ships={[]} typeGrid="view_all" />

      <div>
        <span>My grid</span>
        <Grid coordinatesShot={ennemyPlayer._listCoordinatesShot} ships={player._ships} typeGrid="view_all" />
      </div>
    </>
  );
};

function playGame(): JSX.Element {
  const params = useParams();
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectErrorCurrentGame);
  const game = useAppSelector(selectGameCurrentGame);
  const step = useAppSelector(selectStepCurrentGame);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const { idGame } = params;

  if (!idGame) {
    return <></>;
  }

  useEffect(() => {
    dispatch(getGameByID(idGame));
  }, [idGame]);

  if (!game) {
    return <div>Game not found</div>;
  }

  let player: PlayerType;
  let ennemyPlayer: PlayerType;
  if (
    step === GAME_STEPS.HAS_PLAYER_1_WON ||
    step === GAME_STEPS.PLAYER_1_TO_SHOOT ||
    step === GAME_STEPS.PLAYER_1_WON
  ) {
    player = game._player1 as PlayerType;
    ennemyPlayer = game._player2 as PlayerType;
  } else {
    player = game._player2 as PlayerType;
    ennemyPlayer = game._player1 as PlayerType;
  }

  const shotCoordinate = () => {
    dispatch(
      shot({
        idGame,
        idPlayer: player._id,
        coordinateToShoot: { x, y },
      }),
    );
  };

  const handleUserKeyPress = useCallback(
    (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          setX((x) => {
            if (x === 0) return x;
            return x - 1;
          });
          break;

        case 'ArrowRight':
          setX((x) => {
            if (x === 9) return x;
            return x + 1;
          });
          break;

        case 'ArrowUp':
          setY((y) => {
            if (y === 9) return y;
            return y + 1;
          });
          break;

        case 'ArrowDown':
          setY((y) => {
            if (y === 0) return y;
            return y - 1;
          });
          break;

        case 'Enter':
          shotCoordinate();
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

  useEffect(() => {
    if (step === GAME_STEPS.HAS_PLAYER_1_WON || step === GAME_STEPS.HAS_PLAYER_2_WON) {
      dispatch(
        hasWon({
          idGame,
          idPlayer: player._id,
        }),
      );
      setX(0);
      setY(0);
    }
  }, [step]);

  const isGameFinished = step === GAME_STEPS.PLAYER_1_WON || step === GAME_STEPS.PLAYER_2_WON;

  return (
    <>
      {isGameFinished && <Winner player={player} game={game} />}
      {!isGameFinished && (
        <>
          <div>It is the turn of player : {player._name} </div>
          <span>STEP : {step}</span>

          <div>
            {error && <div>{error}</div>}

            <span>Ennemy grid</span>
            <Grid
              coordinatesShot={player._listCoordinatesShot}
              ships={[]}
              typeGrid="ennemy"
              coordinateToShoot={{ x, y }}
            />
          </div>

          <button onClick={() => shotCoordinate()}>FIRE !</button>

          <div>
            <span>My grid</span>
            <Grid coordinatesShot={ennemyPlayer._listCoordinatesShot} ships={player._ships} />
          </div>
        </>
      )}
    </>
  );
}

export default playGame;
