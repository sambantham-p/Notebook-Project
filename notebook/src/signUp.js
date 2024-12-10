import { Eye, EyeOff } from 'lucide-react';
import React, { useContext } from 'react';

import { AppContext } from './appContext';
import axiosInstance from './utils/axiosinstance';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { validateEmail } from './utils/helper';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [isPassword, setIsPassword] = useState(false);
  const navigate = useNavigate();
  const { setIsLogin, setUsername } = useContext(AppContext);
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/create-user', {
        name: name,
        email: email,
        password: password,
      });
      if (!name && !validateEmail(email) && !password) {
        setError('Invalid Entry, please try again');
        return;
      }

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsLogin(true);
        setUsername(response.data.user.name);
        navigate('/');
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError('An Unexpected error occurred, please try again later.');
      }
    }
  };
  return (
    <div className='w-full h-screen bgNote flex items-center justify-center'>
      <div className='w-1/5 border rounded bg-primary px-7 py-10'>
        <form onSubmit={() => {}}>
          <h4 className='text-2xl-mb-7 text-center text-white'>
            Sign Up NoteBook
          </h4>
          <input
            type='text'
            placeholder='username'
            className='gap-4 mt-8 input-box'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type='text'
            placeholder='email'
            className='gap-4 input-box'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className='flex items-center w-full bg-transparent border-[1.5px] px-5 rounded mb-4'>
            <input
              type={isPassword ? 'password' : 'text'}
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full text-sm bg-transparent py-3 rounded outline-none '
            />
            {isPassword ? (
              <EyeOff
                size={22}
                color='#0597fa'
                onClick={() => setIsPassword(!isPassword)}
              />
            ) : (
              <Eye
                size={22}
                color='#0597fa'
                onClick={() => setIsPassword(!isPassword)}
              />
            )}
          </div>
          {error && <p className='text-sm text-red-500 mt-4'>{error}</p>}
          <button
            type='submit'
            className='btn-primary hover:bg-blue-500'
            onClick={handleSignUp}
          >
            SignUp
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
