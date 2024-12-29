import './App.css';

import { useContext, useEffect, useState } from 'react';

import { AppContext } from './appContext';
import { FixedSidebar } from './Components/fixedSidebar';
import MainContent from './Components/mainContent';
import SearchNote from './Components/searchNote';
import SecondSidebar from './Components/secondSidebar';
import UserPage from './Components/userPage';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { isLogin, username, setIsLogin } = useContext(AppContext);
  const active = useContext(AppContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogin) navigate('/signin');
  });
  return (
    <div className='flex'>
      <div className={'w-14 h-screen bg-slate-800'}>
        <FixedSidebar toggleCollapse={toggleCollapse} />
      </div>
      <div
        className={`h-screen bg-slate-950  border-secondary ${
          active['active'] === 'notes' && !isCollapsed ? 'w-96' : 'w-0'
        }`}
      >
        <SecondSidebar />
      </div>
      <div
        className={`h-screen bg-slate-950  border-secondary ${
          active['active'] === 'search' && !isCollapsed ? 'w-96' : 'w-0'
        }`}
      >
        <SearchNote />
      </div>
      <div
        className={`h-screen bg-slate-950  border-secondary ${
          active['active'] === 'user' && !isCollapsed ? 'w-96' : 'w-0'
        }`}
      >
        <UserPage />
      </div>
      <div className='w-full h-screen text-xl font-semibold bg-black'>
        <MainContent />
      </div>
    </div>
  );
};

export default Home;
