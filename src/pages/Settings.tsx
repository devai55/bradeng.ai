import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, CircleAlert, Key, Lock, Save, Server, Settings } from 'lucide-react';
import { aiService } from '../services/aiService';

const SettingsPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    // Load saved settings from localStorage
    setApiKey(aiService.getApiKey());
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Save settings to localStorage via the service
      aiService.setApiKey(apiKey.trim());
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const validateKey = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'API key is required' });
      return;
    }
    
    setIsSaving(true);
    setMessage(null);
    
    try {
      // Simple test prompt to verify the API key works
      await aiService.generateCompletion('Hello, this is a test message to verify API key functionality.');
      setMessage({ type: 'success', text: 'API key is valid!' });
    } catch (error) {
      console.error('API key validation error:', error);
      setMessage({ type: 'error', text: 'Invalid API key or connection error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold gradient-heading mb-2">Settings</h1>
        <p className="text-gray-600">
          Configure your API settings and learn how to use the app
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-sm mb-6"
      >
        <div className="flex items-center mb-4">
          <div className="bg-indigo-100 p-2 rounded-lg mr-3">
            <Key size={24} className="text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold">API Configuration</h2>
        </div>

        <div className="mb-6">
          <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-1">
           API Key
          </label>
          <div className="relative">
            <input
              id="api-key"
              type={showApiKey ? "text" : "password"}
              className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              <Lock size={16} />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Get an API key from{' '}
            <a
              href="https://Wa.me/+212616469389"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Dev.Med
            </a>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg font-medium text-white
              ${isSaving ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 button-glow'}
              transition-all flex items-center`}
          >
            {isSaving ? (
              <>
                <Server className="animate-spin mr-2" size={18} />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Settings
              </>
            )}
          </button>
          
          <button
            onClick={validateKey}
            disabled={isSaving || !apiKey.trim()}
            className={`px-4 py-2 rounded-lg font-medium text-indigo-600 border border-indigo-200
              ${isSaving || !apiKey.trim() ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-50 hover:bg-indigo-100'}
              transition-all flex items-center`}
          >
            <Check size={18} className="mr-2" />
            Test API Key
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-lg flex items-center
            ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
          >
            {message.type === 'success' ? (
              <Check size={18} className="mr-2" />
            ) : (
              <CircleAlert size={18} className="mr-2" />
            )}
            {message.text}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white p-6 rounded-xl shadow-sm"
      >
        <div className="flex items-center mb-4">
          <div className="bg-purple-100 p-2 rounded-lg mr-3">
            <Settings size={24} className="text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold">Quick Guide to TeachMaster AI</h2>
        </div>

        <div className="space-y-6 text-gray-700">
          <p>
            TeachMaster AI is designed to help educators create engaging content, provide feedback, 
            and streamline lesson planning. Here's how to get the most out of each feature:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <h3 className="font-medium text-indigo-800 mb-2">📝 Feedback System</h3>
              <p className="text-sm text-indigo-700">
                Paste student writing to receive detailed feedback on grammar, vocabulary, and 
                structure. Great for providing consistent assessment and identifying patterns in student work.
              </p>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <h3 className="font-medium text-emerald-800 mb-2">📚 Lesson Plan Generator</h3>
              <p className="text-sm text-emerald-700">
                Set your topic, proficiency level, and timeframe to generate complete lesson plans 
                with activities and assessments. Customize the generated content to fit your teaching style.
              </p>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <h3 className="font-medium text-amber-800 mb-2">❓ Quiz Generator</h3>
              <p className="text-sm text-amber-700">
                Create adaptive quizzes with different question types and difficulty levels. 
                Export them for digital use or print for classroom distribution.
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="font-medium text-purple-800 mb-2">✏️ Note Editor</h3>
              <p className="text-sm text-purple-700">
                Take notes with AI assistance. Select text and use the AI tools to summarize, 
                expand, or simplify content as needed for your educational materials.
              </p>
            </div>
            
            <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
              <h3 className="font-medium text-rose-800 mb-2">💡 Content Enhancer</h3>
              <p className="text-sm text-rose-700">
                Modify existing text resources to match specific proficiency levels. Great for 
                adapting authentic materials or creating differentiated resources for multilevel classes.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">⚙️ Best Practices</h3>
              <p className="text-sm text-blue-700">
                Always review AI-generated content before using it in your classroom. The tool 
                is designed to assist your teaching, not replace your expertise and judgment.
              </p>
            </div>
          </div>
          
          <p className="pt-2">
            To get started, add your OpenRouter API key above and navigate to any of the tools from the 
            dashboard. Each tool includes specific instructions and examples to guide you through the process.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
