import { AppContext } from '../appContext';
import React from 'react';
import { useContext } from 'react';
const Topic = () => {
  const { sharedTitles } = useContext(AppContext);
  return <h2 className='text-white'>{sharedTitles || 'Quick Notes'}</h2>;
};

export default Topic;
