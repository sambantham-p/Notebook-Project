import React, { useContext } from 'react';

import { AppContext } from '../appContext';
import NotebookImg from '../assests/notebookimg.png';
import { NotebookPenIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
  const navigate = useNavigate();
  const { isLogin, username, setIsLogin } = useContext(AppContext);
  return (
    <div className='h-full w-full p-4 bg-gray-900'>
      {isLogin ? (
        <div className='flex flex-col gap-4'>
          <div className='flex flex-row gap-4 items-center justify-start'>
            <NotebookPenIcon size='24px' className='bg-slate-400' />
            <p className='text-center text-white'> Welcome {username} </p>
          </div>
          <button
            className='text-center bg-slate-700 w-11/12 text-white'
            onClick={() => {
              setIsLogin(false);
              localStorage.removeItem('token');
            }}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <div className='w-full '>
            <img
              src={NotebookImg}
              alt='img'
              height={200}
              width={600}
              className='justify-content text-cyan-50'
            />
            <div className='gap-4 w-full text-center py-4'>
              <button
                className='text-center bg-slate-700 w-11/12 text-white'
                onClick={() => navigate('/signin')}
              >
                Sign In
              </button>
            </div>
          </div>
          <div className='flex flex-grow w-full'></div>
          <div className='mb-4 gap-20 w-full text-center py-4'>
            <button
              className='text-center bg-slate-700 w-11/12 text-white'
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
