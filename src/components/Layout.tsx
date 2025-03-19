import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChartBar, ChevronLeft, ChevronRight, FileQuestion, FileText, House, Lightbulb, Menu, MessageSquare, PenTool, Settings, X } from 'lucide-react';
import { aiService } from '../services/aiService';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isAiConfigured, setIsAiConfigured] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    // Check if AI is configured
    setIsAiConfigured(aiService.isConfigured());

    // Try to load sidebar state from localStorage
    const savedState = localStorage.getItem('sidebar_collapsed');
    if (savedState) {
      setSidebarCollapsed(savedState === 'true');
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for route changes to check AI configuration
  useEffect(() => {
    setIsAiConfigured(aiService.isConfigured());
  }, [location]);

  const navItems = [
    { path: '/', icon: <House size={20} />, label: 'Dashboard' },
    { path: '/feedback', icon: <MessageSquare size={20} />, label: 'Feedback System' },
    { path: '/lesson-plans', icon: <BookOpen size={20} />, label: 'Lesson Plans' },
    { path: '/quizzes', icon: <FileQuestion size={20} />, label: 'Quiz Generator' },
    { path: '/notes', icon: <PenTool size={20} />, label: 'Note Editor' },
    { path: '/content-enhancer', icon: <Lightbulb size={20} />, label: 'Content Enhancer' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleSidebarCollapse = () => {
    const newState = !isSidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebar_collapsed', newState.toString());
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile menu button */}
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2 rounded-md shadow-md"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <motion.aside
        initial={isMobile ? { x: '-100%' } : false}
        animate={
          isMobile 
            ? { x: isOpen ? 0 : '-100%' } 
            : { width: isSidebarCollapsed ? '80px' : '240px' }
        }
        transition={{ duration: 0.3 }}
        className={`${isMobile ? 'fixed inset-y-0 left-0 z-40' : ''} bg-white shadow-lg flex flex-col`}
      >
        <div className="flex flex-col h-full relative">
          {/* Collapse button for desktop */}
          {!isMobile && (
            <button
              onClick={toggleSidebarCollapse}
              className="absolute -right-3 top-16 bg-white border border-gray-200 rounded-full p-1 text-gray-500 shadow-sm hover:bg-gray-50 z-10"
            >
              {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}

          <div className="flex items-center justify-center h-16 border-b">
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-2 rounded-md">
                  <BookOpen size={24} />
                </div>
              </motion.div>
              {!isSidebarCollapsed && (
                <motion.h1 
                  className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  TeachMaster AI
                </motion.h1>
              )}
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {!isAiConfigured && !isSidebarCollapsed && (
              <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800 mb-2">
                  AI services not configured
                </p>
                <Link
                  to="/settings"
                  className="text-xs text-indigo-600 font-medium flex items-center hover:underline"
                >
                  <Settings size={12} className="mr-1" />
                  Configure API key
                </Link>
              </div>
            )}
            
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => isMobile && setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                      location.pathname === item.path
                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                    title={isSidebarCollapsed ? item.label : ''}
                  >
                    {item.icon}
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                    {location.pathname === item.path && !isSidebarCollapsed && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute left-0 w-1 h-8 bg-indigo-600 rounded-r-md"
                        initial={false}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <Link
              to="/settings"
              onClick={() => isMobile && setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                location.pathname === '/settings'
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${isSidebarCollapsed ? 'justify-center' : ''}`}
              title={isSidebarCollapsed ? 'Settings' : ''}
            >
              <Settings size={20} />
              {!isSidebarCollapsed && <span>Settings</span>}
              {location.pathname === '/settings' && !isSidebarCollapsed && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute left-0 w-1 h-8 bg-indigo-600 rounded-r-md"
                  initial={false}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          </div>
        </div>
      </motion.aside>

      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main content */}
      <main className={`flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8`}>
        <div className={`${isMobile ? 'pt-12' : ''} pb-20`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
