import React, { createContext, useEffect, useState } from 'react';

import ObjectId from 'bson-objectid';
import axiosInstance from './utils/axiosinstance';
import { jwtDecode } from 'jwt-decode';
import page from './Components/addPage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [sharedTitles, setSharedTitles] = useState([
    { sectionId: '', pageId: '', title: 'Quick Notes' },
  ]);

  const [allSection, setAllSection] = useState([]);
  const [isLogin, setIsLogin] = useState(() => {
    return localStorage.getItem('isLogin') === 'true';
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username');
  });
  const [content, setContent] = useState('');
  const [sections, setSections] = useState([{}]);

  const [activeSectionId, setActiveSectionId] = useState('');
  const [activePageId, setActivePageId] = useState('');
  const [active, setActive] = useState('notes');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          setIsLogin(true);
        } else {
          localStorage.removeItem('token');
          setIsLogin(false);
        }
      } catch (error) {
        console.error('Invalid token or token expired:', error);
        localStorage.removeItem('token');
        setIsLogin(false);
      }
    } else {
      setIsLogin(false);
    }

    localStorage.setItem('isLogin', isLogin);
  }, [isLogin]);

  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);

  const addSection = async (allSection) => {
    let sectionId = ObjectId().toHexString();
    try {
      await addPage(allSection, sectionId);
    } catch (error) {
      console.error('Error adding section:', error);
    }
  };

  const addPage = async (allSections, sectionId) => {
    let sectionIndex = allSections.findIndex(
      (section) => section._id === sectionId
    );

    if (sectionIndex === -1) {
      console.log('Section not found, creating a new section for the page.');

      const newSectionId = ObjectId().toHexString();
      setActiveSectionId(newSectionId);
      const newSection = {
        id: newSectionId,
        sectionId: newSectionId,
        title: `New Section ${allSections.length + 1}`,
        pages: [],
      };

      setSections([...allSections, newSection]);

      try {
        const sectionResponse = await axiosInstance.post('/add-section', {
          sectionId: newSection.sectionId,
          title: newSection.title,
          userId: localStorage.getItem('userId'),
          pages: [],
        });
        console.log('New Section API response:', sectionResponse);

        sectionId = newSection.sectionId;
        sectionIndex = allSections.length;
        allSections = [...allSections, newSection];
      } catch (error) {
        console.error('Error creating new section:', error);
        return;
      }
    }
    let newPageTitle = 'Untitled Page';
    const newPageId = ObjectId().toHexString();
    const newPage = {
      id: newPageId,
      pageId: newPageId,
      title: newPageTitle,
      content: ' ',
      sectionId: sectionId,
    };

    setActivePageId(newPageId);
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.sectionId === sectionId
          ? { ...section, pages: [...section.pages, newPage] }
          : section
      )
    );

    setSharedTitles([
      ...sharedTitles,
      {
        sectionId,
        pageId: newPageId,
        title: newPageTitle,
      },
    ]);

    try {
      const response = await axiosInstance.post('/add-page', {
        title: newPageTitle,
        content: newPage.content,
        sectionId: newPage.sectionId,
        pageId: newPageId,
        userId: localStorage.getItem('userId'),
      });

      console.log('Add Page API response:', response.data);

      if (response.data.error) {
        console.error('Error adding page:', response.data.message);
      }
    } catch (error) {
      console.error('Error in addPage API call:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        active,
        setActive,
        isLogin,
        setIsLogin,
        allSection,
        setAllSection,
        username,
        setUsername,
        sharedTitles,
        setSharedTitles,
        sections,
        setSections,
        addSection,
        addPage,
        setContent,
        content,
        activeSectionId,
        setActiveSectionId,
        activePageId,
        setActivePageId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
