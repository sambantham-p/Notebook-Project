import React, { useCallback, useContext, useEffect, useState } from 'react';

import { AppContext } from '../appContext';
import axiosInstance from '../utils/axiosinstance';

const MainContent = () => {
  const {
    sections,
    activeSectionId,
    activePageId,
    setSharedTitles,
    allSection,
  } = useContext(AppContext);

  // Get the active section and page

  let sectionIndex = allSection.findIndex(
    (section) => section?._id === activeSectionId
  );

  const sectionPages =
    sectionIndex !== -1 && allSection[sectionIndex]?.pages
      ? allSection[sectionIndex].pages
      : [];

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const allActivePage = sectionPages.find((page) => page._id === activePageId);

  const newTitle = allActivePage?.title || '';
  const newContent = allActivePage?.content || '';
  useEffect(() => {
    setContent(newContent);
    setTitle(newTitle);
  }, [newContent, newTitle]);

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }
  const debouncedSaveContent = useCallback(() => {
    const debouncedFn = debounce(async (content) => {
      try {
        const response = await axiosInstance.post('/add-page', {
          pageId: activePageId,
          sectionId: activeSectionId,
          title,
          content,
        });
        console.log('Updated page response:', response);
      } catch (error) {
        console.error('Error updating page content:', error);
      }
    }, 500);

    return (content) => debouncedFn(content);
  }, [activePageId, activeSectionId, title]);
  useEffect(() => {
    return () => {
      debouncedSaveContent()?.cancel?.();
    };
  }, [debouncedSaveContent]);

  const saveContent = (content) => {
    debouncedSaveContent()(content);
  };

  const handleContentChange = (e) => {
    const updatedContent = e.target.value;
    setContent(updatedContent);
    saveContent(updatedContent);
  };

  const activeSection = sections.find(
    (section) => section.id === activeSectionId
  );
  const activePage = activeSection?.pages.find(
    (page) => page.id === activePageId
  );
  const handleTitleChange = (e) => {
    const updatedTitle = e.target.value;
    setTitle(updatedTitle);
    setSharedTitles((prevTitles) => {
      const updatedTitles = prevTitles.map((title) => {
        if (
          title.sectionId === activeSectionId &&
          title.pageId === activePageId
        ) {
          return { ...title, title: updatedTitle };
        }
        return title;
      });

      if (
        !updatedTitles.find(
          (title) =>
            title.sectionId === activeSectionId && title.pageId === activePageId
        )
      ) {
        updatedTitles.push({
          sectionId: activeSectionId,
          pageId: activePageId,
          title: updatedTitle,
        });
      }

      return updatedTitles;
    });
  };

  return (
    <div className='pt-4 pl-4 pr-4 h-screen w-full flex flex-col'>
      {/* Above HR Line Section */}
      <div className='text-area-above'>
        <textarea
          autoCorrect='on'
          spellCheck='true'
          autoCapitalize='on'
          value={title}
          onChange={handleTitleChange}
          className='w-1/5 h-8 text-white bg-gray-800 focus:outline-none focus:ring focus:ring-indigo-500 resize-none m-0'
        />
        <hr width={304} color='white' className='mb-4 m-0' />
      </div>

      {/* Below HR Line Section */}
      <div className='text-area-below flex-grow pt-4 w-full'>
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder={`Editing content for ${
            activePage?.title || 'this page'
          }`}
          className='w-11/12 h-5/6 text-white bg-gray-800 focus:outline-none focus:ring focus:ring-indigo-500 resize-none'
        />
      </div>
    </div>
  );
};

export default MainContent;
