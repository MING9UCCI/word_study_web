import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WordForm } from './components/WordForm';
import { WordList } from './components/WordList';
import { StudyMode } from './components/StudyMode';
import { BottomNav } from './components/BottomNav';
import { GroupList } from './components/GroupList';
import { QuizMode } from './components/QuizMode';
import { DataManagement } from './components/DataManagement';
import { useWords } from './hooks/useWords';
import { ArrowLeft } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('toeic-dark-mode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [currentMode, setCurrentMode] = useState('manage'); // 'manage' | 'study'
  const [currentGroupId, setCurrentGroupId] = useState(null); // null = showing group list
  const [studyType, setStudyType] = useState('flashcard'); // 'flashcard' | 'quiz'

  const { words, groups, addWord, deleteWord, editWord, toggleMemorized, addGroup, deleteGroup, importData, exportData } = useWords();

  useEffect(() => {
    localStorage.setItem('toeic-dark-mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Filter words by current group
  const currentGroupWords = currentGroupId
    ? words.filter(w => w.groupId === currentGroupId)
    : [];

  const currentGroup = groups.find(g => g.id === currentGroupId);

  const handleBack = () => {
    setCurrentGroupId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-900 dark:text-white">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="mx-auto max-w-md px-4 pb-24 pt-6">
        {/* Back Button for Group View */}
        {currentGroupId && (
          <button
            onClick={handleBack}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Collections
          </button>
        )}

        {currentMode === 'manage' ? (
          !currentGroupId ? (
            <>
              <GroupList
                groups={groups}
                onSelectGroup={setCurrentGroupId}
                onAddGroup={addGroup}
                onDeleteGroup={deleteGroup}
              />
              <DataManagement onImport={importData} onExport={exportData} />
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{currentGroup?.name}</h2>
                <span className="text-sm text-gray-500">{currentGroupWords.length} words</span>
              </div>
              <WordForm onAdd={(en, ko) => addWord(en, ko, currentGroupId)} />
              <WordList words={currentGroupWords} onDelete={deleteWord} onEdit={editWord} />
            </div>
          )
        ) : (
          /* Study Mode */
          !currentGroupId ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Select a Collection to Study</h2>
              <GroupList
                groups={groups}
                onSelectGroup={setCurrentGroupId}
                onAddGroup={addGroup}
                onDeleteGroup={deleteGroup}
              />
            </div>
          ) : (
            <div className="h-[calc(100vh-14rem)]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold text-gray-500">{currentGroup?.name}</h2>
                <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                  <button
                    onClick={() => setStudyType('flashcard')}
                    className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${studyType === 'flashcard'
                      ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                      }`}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setStudyType('quiz')}
                    className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${studyType === 'quiz'
                      ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                      }`}
                  >
                    Quiz
                  </button>
                </div>
              </div>

              {studyType === 'flashcard' ? (
                <StudyMode words={currentGroupWords} onToggleMemorized={toggleMemorized} />
              ) : (
                <QuizMode words={currentGroupWords} />
              )}
            </div>
          )
        )}
      </main>

      <BottomNav currentMode={currentMode} onModeChange={(mode) => {
        setCurrentMode(mode);
        setCurrentGroupId(null); // Reset group selection when changing tabs
      }} />
    </div>
  );
}

export default App;
