import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '../../components/Grid';
import { PlayerType } from '../../core/Game/domain/entity/player';
import {
  GAME_STEPS,
  getGameByID,
  selectErrorCurrentGame,
  selectGameCurrentGame,
  selectStepCurrentGame,
} from '../../features/game/gameSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

function playGame(): JSX.Element {
  const params = useParams();
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectErrorCurrentGame);
  const game = useAppSelector(selectGameCurrentGame);
  const step = useAppSelector(selectStepCurrentGame);

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
  if (step === GAME_STEPS.HAS_PLAYER_1_WON || step === GAME_STEPS.PLAYER_1_TO_SHOOT) {
    player = game._player1 as PlayerType;
    ennemyPlayer = game._player2 as PlayerType;
  } else {
    player = game._player2 as PlayerType;
    ennemyPlayer = game._player1 as PlayerType;
  }

  return (
    <>
      <div>It is the turn of player : {player._name} </div>

      <div>
        <span>Ennemy grid</span>
        <Grid coordinatesShot={player._listCoordinatesShot} ships={[]} typeGrid="ennemy" />
      </div>

      <div>
        <span>My grid</span>
        <Grid coordinatesShot={ennemyPlayer._listCoordinatesShot} ships={player._ships} />
      </div>

      {<div>{game._type}</div>}
      {error && <div>{error}</div>}
    </>
  );
}

export default playGame;
