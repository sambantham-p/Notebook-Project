import { History, Notebook, Search, User2Icon } from 'lucide-react';
import { useContext, useState } from 'react';

import { AppContext } from '../appContext';

export const FixedSidebar = ({ toggleCollapse }) => {
  const { active, setActive } = useContext(AppContext);
  return (
    <div className='h-screen w-full flex flex-col gap-4 bg-gray-800 text-white'>
      {/* Notes Section */}
      <div
        onClick={() => {
          setActive('notes');
          toggleCollapse();
        }}
        className={`pb-12 pt-8 pl-2 gap-10 flex flex-col cursor-pointer
          transition-colors
          ${active === 'notes' ? 'duration-500 ease-linear bg-primary' : ''}`}
      >
        <Notebook size='24px' color='white' />
      </div>

      {/* Search Section */}
      <div
        onClick={() => {
          setActive('search');
          toggleCollapse();
        }}
        className={`pb-12 pt-8 pl-2 gap-10 flex flex-col cursor-pointer
          transition-colors
          ${active === 'search' ? 'duration-500 ease-linear bg-primary' : ''}`}
      >
        <Search size='24px' color='white' />
      </div>

      {/* History Section */}
      <div
        onClick={() => {
          setActive('history');
          toggleCollapse();
        }}
        className={`pb-12 pt-8 pl-2 gap-10 flex flex-col cursor-pointer
          transition-colors
          ${active === 'history' ? 'duration-500 ease-linear bg-primary' : ''}`}
      >
        <History size='24px' color='white' />
      </div>

      {/* User Section */}
      <div
        onClick={() => {
          setActive('user');
          toggleCollapse();
        }}
        className={`pb-12 pt-8 pl-2 gap-10 flex flex-col cursor-pointer
          transition-colors
          ${active === 'user' ? 'duration-500 ease-linear bg-primary' : ''}`}
      >
        <User2Icon size='24px' color='white' />
      </div>
    </div>
  );
};
