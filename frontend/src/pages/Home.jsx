import React from 'react'
import Game from '../components/Game'

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <Game user={user} />
    </>
  )
}

export default Home