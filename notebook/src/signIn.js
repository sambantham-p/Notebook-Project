import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';

import { AppContext } from './appContext';
import axiosInstance from './utils/axiosinstance';
import { useState } from 'react';
import { validateEmail } from './utils/helper';

const SignIn = () => {
  const { setIsLogin, setUsername } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isPassword, setIsPassword] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    try {
      const response = await axiosInstance.post('/login', {
        email: email,
        password: password,
      });
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsLogin(true);
        setUsername(response.data.username);
        navigate('/');
      }
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        setError(e.response.data.message);
      } else {
        setError('An Unexpected error occurred');
      }
    }
  };
  return (
    <div className='w-full h-screen bgNote flex items-center justify-center'>
      <div className='w-1/5 border rounded bg-primary px-7 py-10'>
        <form onSubmit={() => {}}>
          <h4 className='text-2xl-mb-7 text-center text-white'>
            Sign In NoteBook
          </h4>
          <input
            type='text'
            placeholder='email'
            className='gap-4 mt-8 input-box'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className='flex items-center w-full bg-transparent border-[1.5px] px-5 rounded mb-4'>
            <input
              type={isPassword ? 'text' : 'password'}
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
            className='btn-primary  hover:bg-blue-500'
            onClick={handleLogin}
          >
            SignIn
          </button>
          <p className='text-sm text-center mt-4'>
            Not registered yet ?{' '}
            <Link to='/signup' className='font-medium text-blue-400 underline'>
              Create an Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
