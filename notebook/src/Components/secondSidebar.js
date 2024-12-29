import {
  Book,
  ChevronDown,
  ChevronUp,
  DeleteIcon,
  StickyNote,
} from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';

import { AppContext } from '../appContext';
import axiosInstance from '../utils/axiosinstance';

const SecondSidebar = () => {
  const {
    sections,
    addSection,
    addPage,
    activeSectionId,
    setActiveSectionId,
    activePageId,
    setActivePageId,
    sharedTitles,
    setContent,
    setSections,
    setAllSection,
    allSection,
  } = useContext(AppContext);

  const [editingSectionId, setEditingSectionId] = useState(null);

  const handleTitleChange = async (sectionId, newTitle) => {
    try {
      setSections((prevSection) => {
        return prevSection.map((section) =>
          section.id === parseInt(sectionId)
            ? { ...section, title: newTitle }
            : section
        );
      });
      const response = await axiosInstance.post('/add-section', {
        sectionId: sectionId,
        title: newTitle,
        userId: localStorage.getItem('userId'),
      });
      console.log('Updated section response:', response.data.section.title);
    } catch (error) {
      console.error('Error updating section title:', error);
    }
  };

  const finalTitle = async (sectionId, newTitle) => {
    try {
      const response = await axiosInstance.post('/add-section', {
        sectionId: sectionId,
        title: newTitle,
        userId: localStorage.getItem('userId'),
      });
      console.log('Updated section response:', response);
    } catch (error) {
      console.error('Error updating section title:', error);
    }
  };

  useEffect(() => {
    axiosInstance
      .get('/get-sections', {
        userId: localStorage.getItem('userId'),
      })
      .then((response) => {
        setAllSection(response.data.sections || []);
      })
      .catch((error) => {
        console.error('Error fetching sections:', error);
      });
  }, [sections, setAllSection]);

  useEffect(() => {
    if (sharedTitles.length > 1) {
      const updatePageTitle = async () => {
        try {
          await axiosInstance.post('/add-page', {
            pageId: sharedTitles[sharedTitles.length - 1].pageId,
            sectionId: sharedTitles[sharedTitles.length - 1].sectionId,
            title: sharedTitles[sharedTitles.length - 1].title,
            userId: localStorage.getItem('userId'),
          });
          console.log('Page title updated successfully');
        } catch (error) {
          console.error('Failed to update page title:', error);
        }
      };
      updatePageTitle();
    }
  }, [sharedTitles]);

  const handleDelete = async (sectionId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this section and all its notes?'
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/delete-section/${sectionId}`);
      // Remove the section locally or trigger a refresh
      setAllSection((prevSections) =>
        prevSections.filter((s) => s._id !== sectionId)
      );
      console.log('Section deleted successfully.');
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Failed to delete the section.');
    }
  };

  return (
    <div className='flex flex-col h-full w-full p-4 bg-gray-900'>
      {/* Section and Pages List */}
      <div className='flex-grow overflow-y-auto'>
        {allSection.map((section) => (
          <div key={section._id} className='mb-4 flex justify-between flex-row'>
            <div
              className={`flex items-center gap-3  cursor-pointer ${
                activeSectionId === section._id ? 'text-white' : 'text-gray-400'
              }`}
              onClick={() => {
                setActiveSectionId(section._id);
              }}
            >
              <StickyNote size={24} className='text-white' />
              {editingSectionId === section._id ? (
                <input
                  type='text'
                  value={section.title}
                  onChange={(e) => {
                    handleTitleChange(section._id, e.target.value);
                  }}
                  onBlur={() => {
                    finalTitle(section._id, section.title);
                    setEditingSectionId(null);
                  }}
                  className='font-bold bg-transparent border-b border-gray-500 focus:outline-none focus:border-white text-white'
                  autoFocus
                />
              ) : (
                <h3
                  className='font-bold'
                  onDoubleClick={() => {
                    setEditingSectionId(section._id);
                  }}
                >
                  {section.title}
                </h3>
              )}
              {activeSectionId === section._id ? (
                <ChevronUp size={24} className='text-white' />
              ) : (
                <ChevronDown size={24} className='text-white' />
              )}
            </div>

            {activeSectionId === section._id && (
              <div className='pl-6'>
                {section.pages.map((page) => (
                  <div
                    key={page._id}
                    className={`flex items-center gap-2 cursor-pointer ${
                      activePageId === page._id ? 'text-white' : 'text-gray-400'
                    } hover:text-white`}
                    onClick={() => {
                      setActivePageId(page._id);
                    }}
                  >
                    <Book size={20} />
                    <p>
                      {sharedTitles.find(
                        (title) =>
                          title.pageId === page._id &&
                          title.sectionId === section._id
                      )?.title || page.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <DeleteIcon
              size={30}
              color='red'
              className='pointer:none'
              onClick={() => handleDelete(section._id)}
            />
          </div>
        ))}
      </div>

      <footer className='flex gap-4 w-full text-center mt-4'>
        <button
          className='w-1/2 py-2 bg-gray-900 text-white rounded'
          onClick={() => {
            addSection(allSection);
            setContent('');
          }}
        >
          Add Topic
        </button>
        <button
          className='w-1/2 py-2 bg-gray-900 text-white rounded'
          onClick={() => {
            if (allSection.length > 0) {
              addPage(allSection, activeSectionId);
              setContent('');
            }
          }}
        >
          Add Page
        </button>
      </footer>
    </div>
  );
};

export default SecondSidebar;
