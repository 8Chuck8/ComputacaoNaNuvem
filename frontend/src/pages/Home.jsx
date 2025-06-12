import React from 'react';
import Game from '../components/Game';

const Home = ({ user }) => {
  return (
    <div>
      <Game user={user} />
    </div>
  );
};

export default Home;