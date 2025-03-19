import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FeedbackSystem from './pages/FeedbackSystem';
import LessonGenerator from './pages/LessonGenerator';
import QuizGenerator from './pages/QuizGenerator';
import NoteEditor from './pages/NoteEditor';
import ContentEnhancer from './pages/ContentEnhancer';
import SettingsPage from './pages/Settings';
import './index.css';

export function App() {
  useEffect(() => {
    // Include required fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900 antialiased"
      style={{ fontFamily: "'Inter', sans-serif" }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="feedback" element={<FeedbackSystem />} />
          <Route path="lesson-plans" element={<LessonGenerator />} />
          <Route path="quizzes" element={<QuizGenerator />} />
          <Route path="notes" element={<NoteEditor />} />
          <Route path="content-enhancer" element={<ContentEnhancer />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
