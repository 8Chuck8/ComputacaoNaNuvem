import React from 'react'
import { NavLink } from 'react-router-dom';
import Home from '../pages/Home';
import Admin from '../pages/Admin';
import Scores from '../pages/Scores';

const Navbar = (props) => {
  console.log("Navbar user:", props.user);
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav mx-auto'>
            <li className='nav-item'>
              <NavLink to={'/'} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Home</NavLink>
            </li>
            {
              props.user ? <>
                  <li className='nav-item'>
                    <NavLink to={'/scores'} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Scores</NavLink>
                  </li>
                  {
                    props.user.role === 'admin' &&
                    <li className='nav-item'>
                      <NavLink to={'/admin'} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Admin</NavLink>
                    </li>
                  }
              </>
              : <>
                  <NavLink to={'/login'} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Login</NavLink>
                </>
            }
          </ul>
          {
            props.user &&
            <p className='nav-item p-0 my-auto'>
              <NavLink to={'/logout'} className={'nav-link '}>Logout</NavLink>
            </p>
          }
        </div>
      </div>
    </nav>
  )
}

export default Navbar