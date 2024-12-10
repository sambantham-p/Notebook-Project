import React from 'react';

const searchNote = () => {
  return (
    <div className='flex flex-col h-full w-full p-4 bg-gray-900'>
      <div className='flex gap-4 w-full text-center'>
        <input
          type='text'
          placeholder='Search notes...'
          className='w-full bg-slate-700'
        />
      </div>
    </div>
  );
};

export default searchNote;
