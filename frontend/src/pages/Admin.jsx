import React, { useState } from 'react';
import UsersComponent from '../components/UsersComponent';
import QuestionsComponent from '../components/QuestionsComponent';
import AnswersComponent from '../components/AnswersComponent';
import ScoresComponent from '../components/ScoresComponent';

const Admin = () => {
  const items = ['users', 'questions'];
  const [display, setDisplay] = useState('users');

  const handleDisplayChange = (e) => {
    setDisplay(e.target.id);
  };

  const isActive = (id) => display === id;

  return (
    <>
      <div className='my-4'>
        <ul className='d-flex justify-content-center gap-5 list-unstyled'>
          {items.map((item) => (
            <li
              key={item}
              id={item}
              onClick={handleDisplayChange}
              className={`px-3 py-1 rounded cursor-pointer  ${isActive(item) ? 'border bg-light shadow-sm' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </li>
          ))}
        </ul>
      </div>

      <div className='d-flex justify-content-center align-items-center shadow m-4 p-4 rounded'>
        {display === 'users' && <UsersComponent />}
        {display === 'questions' && <QuestionsComponent />}
        {/* {display === 'scores' && <ScoresComponent />} */}
      </div>
    </>
  );
};

export default Admin;
