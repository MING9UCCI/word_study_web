import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WordForm } from './components/WordForm';
import { WordList } from './components/WordList';
import { StudyMode } from './components/StudyMode';
import { BottomNav } from './components/BottomNav';
import { DesktopNav } from './components/DesktopNav';
import { GroupList } from './components/GroupList';
import { QuizMode } from './components/QuizMode';
import { DataManagement } from './components/DataManagement';
import { SettingsModal } from './components/SettingsModal';
import { Settings } from './components/Settings';
import { Dashboard } from './components/Dashboard';
import { Memo } from './components/Memo';
import { PhotoImport } from './components/PhotoImport';
import { useWords } from './hooks/useWords';
import { useAuth } from './hooks/useAuth';
import { useFirestore } from './hooks/useFirestore';
import { defaultSets } from './data/defaultData';
import { chineseVocab } from './data/chineseData';
import { ArrowLeft } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('toeic-dark-mode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [ttsSettings, setTtsSettings] = useState(() => {
    const saved = localStorage.getItem('toeic-tts-settings');
    return saved ? JSON.parse(saved) : { rate: 1.0, voiceURI: null };
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPhotoImportOpen, setIsPhotoImportOpen] = useState(false);

  const [currentMode, setCurrentMode] = useState('manage'); // 'manage' | 'study' | 'dashboard' | 'memo'
  const [currentGroupId, setCurrentGroupId] = useState(null); // null = showing group list
  const [studyType, setStudyType] = useState('flashcard'); // 'flashcard' | 'quiz'

  // Memo state
  const [memos, setMemos] = useState(() => {
    const saved = localStorage.getItem('toeic-memos');
    return saved ? JSON.parse(saved) : [];
  });

  // Save memos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('toeic-memos', JSON.stringify(memos));
  }, [memos]);

  const { words, groups, addWord, deleteWord, editWord, toggleMemorized, updateWordProgress, addGroup, deleteGroup, editGroup, importData, exportData, loadDefaultSets, setData } = useWords();
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const { syncToCloud, syncFromCloud, mergeData } = useFirestore();

  useEffect(() => {
    localStorage.setItem('toeic-dark-mode', JSON.stringify(darkMode));
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#111827'; // Ensure body matches dark theme
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#111827'); // gray-900
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f9fafb'; // Ensure body matches light theme
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#f9fafb'); // gray-50
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('toeic-tts-settings', JSON.stringify(ttsSettings));
  }, [ttsSettings]);

  // Cloud sync effect
  useEffect(() => {
    if (!user) return;

    // Sync from cloud when user logs in
    const loadCloudData = async () => {
      try {
        const cloudData = await syncFromCloud(user.uid);
        if (cloudData.words.length > 0 || cloudData.groups.length > 0) {
          // Merge local and cloud data
          const merged = mergeData(words, cloudData.words, groups, cloudData.groups);
          setData(merged.words, merged.groups);
        }
      } catch (error) {
        console.error('Failed to sync from cloud:', error);
      }
    };

    loadCloudData();
  }, [user]);

  // Auto-sync to cloud when data changes (debounced)
  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      syncToCloud(user.uid, words, groups, memos).catch(error => {
        console.error('Failed to sync to cloud:', error);
      });
    }, 2000); // Debounce 2 seconds

    return () => clearTimeout(timer);
  }, [words, groups, memos, user]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Filter words by current group
  const currentGroupWords = currentGroupId
    ? words.filter(w => w.groupId === currentGroupId)
    : [];

  const currentGroup = groups.find(g => g.id === currentGroupId);

  const handleBack = () => {
    setCurrentGroupId(null);
  };

  // Memo management functions
  const addMemo = (content) => {
    const newMemo = {
      id: Date.now().toString(),
      content,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setMemos(prev => [newMemo, ...prev]);
  };

  const deleteMemo = (id) => {
    if (confirm('이 메모를 삭제하시겠습니까?')) {
      setMemos(prev => prev.filter(m => m.id !== id));
    }
  };

  const editMemo = (id, newContent) => {
    setMemos(prev => prev.map(m =>
      m.id === id
        ? { ...m, content: newContent, updatedAt: Date.now() }
        : m
    ));
  };

  const renderContent = () => {
    // Memo Mode
    if (currentMode === 'memo') {
      return (
        <Memo
          memos={memos}
          onAddMemo={addMemo}
          onDeleteMemo={deleteMemo}
          onEditMemo={editMemo}
        />
      );
    }

    // Dashboard Mode
    if (currentMode === 'dashboard') {
      return <Dashboard words={words} groups={groups} />;
    }

    if (currentMode === 'manage') {
      if (!currentGroupId) {
        return (
          <>
            <GroupList
              groups={groups}
              onSelectGroup={setCurrentGroupId}
              onAddGroup={addGroup}
              onDeleteGroup={deleteGroup}
              onEditGroup={editGroup}
            />
            <DataManagement
              onImport={importData}
              onExport={exportData}
              onOpenPhotoImport={() => setIsPhotoImportOpen(true)}
              onLoadDefaults={() => {
                // Check if default sets already exist
                const defaultSetNames = defaultSets.map(s => s.name);
                const existingSetNames = groups.map(g => g.name);
                const alreadyLoaded = defaultSetNames.some(name => existingSetNames.includes(name));

                if (alreadyLoaded) {
                  alert('⚠️ 추천 세트가 이미 추가되어 있습니다.');
                  return;
                }

                if (confirm('추천 TOEIC 세트 3개 (총 90개 단어)를 불러올까요?')) {
                  loadDefaultSets(defaultSets);
                  alert('✓ 추천 세트가 추가되었습니다!');
                }
              }}
              onImportChinese={() => {
                const chineseGroupName = '다락원 중국어 STEP1';
                if (groups.some(g => g.name === chineseGroupName)) {
                  alert('⚠️ 중국어 단어장이 이미 존재합니다.');
                  return;
                }

                if (confirm('중국어 단어장 (6, 7, 9, 10과)을 추가하시겠습니까?')) {
                  // We can repurpose loadDefaultSets or just manually add
                  const newSet = {
                    name: chineseGroupName,
                    words: chineseVocab
                  };
                  loadDefaultSets([newSet]);
                  alert('✓ 중국어 단어장이 추가되었습니다!');
                }
              }}
            />
          </>
        );
      }
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{currentGroup?.name}</h2>
            <span className="text-sm text-gray-500">{currentGroupWords.length} words</span>
          </div>
          <WordForm onAdd={(en, ko, ex) => addWord(en, ko, currentGroupId, ex)} />
          <WordList
            words={currentGroupWords}
            onDelete={deleteWord}
            onEdit={editWord}
            ttsSettings={ttsSettings}
          />
        </div>
      );
    }

    // Study Mode
    if (!currentGroupId) {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Select a Collection to Study</h2>
          <GroupList
            groups={groups}
            onSelectGroup={setCurrentGroupId}
            onAddGroup={addGroup}
            onDeleteGroup={deleteGroup}
            onEditGroup={editGroup}
          />
        </div>
      );
    }

    return (
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
          <StudyMode
            words={currentGroupWords}
            onToggleMemorized={toggleMemorized}
            updateWordProgress={updateWordProgress}
            ttsSettings={ttsSettings}
            onExit={handleBack}
          />
        ) : (
          <QuizMode words={currentGroupWords} />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-900 dark:text-white">
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        user={user}
        onLogin={async () => {
          try {
            await signInWithGoogle();
          } catch (error) {
            alert('로그인 실패: ' + error.message);
          }
        }}
        onLogout={async () => {
          try {
            await signOut();
          } catch (error) {
            alert('로그아웃 실패: ' + error.message);
          }
        }}
        onLogoClick={() => {
          setCurrentGroupId(null);
          setCurrentMode('manage');
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={ttsSettings}
        onSave={setTtsSettings}
      />

      <PhotoImport
        isOpen={isPhotoImportOpen}
        onClose={() => setIsPhotoImportOpen(false)}
        groups={groups}
        onAddGroup={addGroup}
        onSave={(newWords, groupId) => {
            newWords.forEach(w => {
                addWord(w.english, w.korean, groupId, w.example, w.pronunciation || '');
            });
        }}
      />

      <DesktopNav currentMode={currentMode} onModeChange={setCurrentMode} />

      <main className="mx-auto max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl md:ml-64 px-4 md:px-6 lg:px-8 pb-24 md:pb-6 pt-6">
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

        {renderContent()}
      </main>

      <BottomNav currentMode={currentMode} onModeChange={(mode) => {
        setCurrentMode(mode);
        setCurrentGroupId(null); // Reset group selection when changing tabs
      }} />
    </div>
  );
}

export default App;
