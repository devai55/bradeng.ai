import { useState } from 'react';
import { motion } from 'framer-motion';
import { CircleAlert, ArrowRight, Book, BookOpen, ChevronDown, ChevronUp, Clock, CloudDownload, Lightbulb, Sparkles } from 'lucide-react';
import { aiService } from '../services/aiService';

const ContentEnhancer = () => {
  const [originalText, setOriginalText] = useState('');
  const [enhancedText, setEnhancedText] = useState<string | null>(null);
  const [targetLevel, setTargetLevel] = useState('B1');
  const [enhancementType, setEnhancementType] = useState('simplify');
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const levelOptions = [
    { value: 'A1', label: 'Beginner (A1)' },
    { value: 'A2', label: 'Elementary (A2)' },
    { value: 'B1', label: 'Intermediate (B1)' },
    { value: 'B2', label: 'Upper Intermediate (B2)' },
    { value: 'C1', label: 'Advanced (C1)' },
    { value: 'C2', label: 'Proficiency (C2)' }
  ];

  const enhancementOptions = [
    { value: 'simplify', label: 'Simplify Content', description: 'Make complex text easier to understand' },
    { value: 'enrich', label: 'Enrich Vocabulary', description: 'Add more advanced vocabulary to the text' },
    { value: 'culturalContext', label: 'Add Cultural Context', description: 'Include cultural notes and explanations' },
    { value: 'interactive', label: 'Make Interactive', description: 'Add questions and activities related to the text' },
    { value: 'visual', label: 'Add Visual Cues', description: 'Include emoji and formatting to aid comprehension' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalText.trim()) return;
    
    // Check if API is configured
    if (!aiService.isConfigured()) {
      setError('AI service not configured. Please add your API key in Settings.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Use the AI service to enhance content
      const prompt = `
        Enhance the following educational content with these parameters:
        - Enhancement type: ${enhancementType}
        - Target language level: ${targetLevel}
        ${additionalInstructions ? `- Additional instructions: ${additionalInstructions}` : ''}
        
        Original content:
        ${originalText}
        
        Apply the requested enhancement and return only the enhanced content.
      `;
      
      const result = await aiService.generateCompletion(prompt);
      setEnhancedText(result);
    } catch (error) {
      console.error('Enhancement error:', error);
      setError('Failed to enhance content. Please check your API configuration and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!enhancedText) return;
    
    const element = document.createElement('a');
    const file = new Blob([enhancedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'enhanced-content.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold gradient-heading mb-2">Content Enhancement Tool</h1>
        <p className="text-gray-600">
          Modify text resources to match specific proficiency levels and learning needs
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="mb-4">
              <label htmlFor="original-text" className="block text-sm font-medium text-gray-700 mb-1">
                Original Text
              </label>
              <textarea
                id="original-text"
                rows={10}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Paste or type the text you want to enhance..."
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                required
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="target-level" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Proficiency Level
                </label>
                <select
                  id="target-level"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value)}
                >
                  {levelOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="enhancement-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Enhancement Type
                </label>
                <select
                  id="enhancement-type"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={enhancementType}
                  onChange={(e) => setEnhancementType(e.target.value)}
                >
                  {enhancementOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                {showAdvanced ? <ChevronUp size={16} className="mr-1" /> : <ChevronDown size={16} className="mr-1" />}
                {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
              </button>
              
              {showAdvanced && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                  <label htmlFor="additional-instructions" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Instructions
                  </label>
                  <textarea
                    id="additional-instructions"
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Specific requirements or focus areas for enhancement..."
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                  ></textarea>
                </div>
              )}
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg text-red-700 flex items-start">
                <CircleAlert size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || !originalText.trim()}
              className={`w-full px-6 py-3 rounded-lg font-medium text-white 
                ${loading || !originalText.trim()
                  ? 'bg-gray-400' 
                  : 'bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-700 hover:to-pink-600 button-glow'
                } transition-all`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Clock className="animate-spin mr-2" size={18} />
                  Enhancing Content...
                </span>
              ) : 'Enhance Content with AI'}
            </button>
          </form>
          
          <div className="mt-6 bg-indigo-50 p-5 rounded-xl border border-indigo-100">
            <h3 className="text-lg font-medium text-indigo-900 mb-3 flex items-center">
              <BookOpen size={18} className="mr-2" />
              Enhancement Guide
            </h3>
            <ul className="space-y-2">
              {enhancementOptions.map(option => (
                <li key={option.value} className="flex items-start">
                  <div className={`p-1 rounded-full ${enhancementType === option.value ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'} mr-2`}>
                    <ArrowRight size={14} />
                  </div>
                  <div>
                    <span className="font-medium text-indigo-800">{option.label}:</span>{' '}
                    <span className="text-sm text-indigo-700">{option.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {enhancedText ? (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Sparkles size={20} className="mr-2 text-rose-500" />
                  Enhanced Content
                </h2>
                <button
                  onClick={handleDownload}
                  className="flex items-center px-3 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  <CloudDownload size={16} className="mr-1" />
                  Download
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Level: {targetLevel}
                </div>
                <div className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-sm">
                  {enhancementOptions.find(o => o.value === enhancementType)?.label}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Enhancement Summary</h3>
                <p className="text-sm text-gray-700">
                  This content has been adapted for {levelOptions.find(l => l.value === targetLevel)?.label} level 
                  using the {enhancementOptions.find(o => o.value === enhancementType)?.label.toLowerCase()} technique. 
                  {additionalInstructions && ' Additional instructions were applied as specified.'}
                </p>
              </div>
              
              <div className="p-4 bg-white border border-gray-200 rounded-lg overflow-y-auto max-h-[500px]">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: enhancedText.replace(/\n/g, '<br/>') }}>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col items-center justify-center text-center">
              <div className="bg-rose-100 p-4 rounded-full mb-4">
                <Lightbulb size={32} className="text-rose-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">AI Content Enhancer</h3>
              <p className="text-gray-600 mb-6">
                Input your text on the left and select enhancement options to adapt it for different proficiency levels.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg w-full">
                <h4 className="font-medium text-gray-800 mb-2 text-sm">Perfect for:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Adapting authentic materials for language learners</li>
                  <li>• Creating differentiated resources for multilevel classes</li>
                  <li>• Simplifying complex texts while preserving meaning</li>
                  <li>• Adding cultural context to support comprehension</li>
                  <li>• Enhancing engagement with interactive elements</li>
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContentEnhancer;
