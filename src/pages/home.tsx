import { Link } from 'react-router-dom';

function Home(): JSX.Element {
  return (
    <>
      <div>Welcome to the best battleship game !</div>
      <Link to="/new-game">Start a new game</Link>
      <Link to="/counter">COUNTER</Link>
    </>
  );
}

export default Home;
