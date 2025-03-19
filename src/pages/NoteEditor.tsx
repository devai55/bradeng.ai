import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Book, CheckCheck, Clock, Copy, FileDown, PenTool, Save, Sparkles, Wand } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';

const NoteEditor = () => {
  const [title, setTitle] = useState('Untitled Note');
  const [noteContent, setNoteContent] = useState('<p>Start writing your notes here. Select text and use the AI tools on the right to enhance it.</p>');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [processingAI, setProcessingAI] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [aiResult, setAiResult] = useState<string | null>(null);

  // AI suggestion options
  const aiOptions = [
    { id: 'summarize', label: 'Summarize', description: 'Create a concise summary of your text', icon: <Book size={16} /> },
    { id: 'expand', label: 'Expand', description: 'Elaborate on the selected text with more details', icon: <FileDown size={16} /> },
    { id: 'simplify', label: 'Simplify', description: 'Make complex text easier to understand', icon: <Wand size={16} /> },
    { id: 'correct', label: 'Grammar Check', description: 'Fix grammar and spelling errors', icon: <CheckCheck size={16} /> },
    { id: 'academic', label: 'Academic Style', description: 'Convert to formal academic language', icon: <PenTool size={16} /> },
    { id: 'creative', label: 'Creative Style', description: 'Make writing more engaging and creative', icon: <Sparkles size={16} /> },
  ];

  const editorRef = useRef<HTMLDivElement | null>(null);

  const saveNote = () => {
    setSaving(true);
    
    // Simulate saving process
    setTimeout(() => {
      setSaving(false);
      // Would save to localStorage or a database in a real implementation
      localStorage.setItem('savedNote', JSON.stringify({
        title,
        content: noteContent
      }));
    }, 1000);
  };

  const copyContent = () => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = noteContent;
    navigator.clipboard.writeText(tempElement.innerText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const insertTextAtCursor = (text: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    // Create a temporary div with the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    
    // Extract the nodes from the temporary div
    const fragment = document.createDocumentFragment();
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
    
    // Delete current selection and insert new content
    range.deleteContents();
    range.insertNode(fragment);
    
    // Update the editor content
    if (editorRef.current) {
      setNoteContent(editorRef.current.innerHTML);
    }
  };

  const handleAIAction = (actionId: string) => {
    // Get selected text from editor
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (!selectedText) {
      alert("Please select some text first before applying AI enhancements.");
      return;
    }
    
    setSelectedText(selectedText);
    setProcessingAI(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const modifiedText = processWithAI(selectedText, actionId);
      setAiResult(modifiedText);
      
      // Insert the result into the editor
      insertTextAtCursor(modifiedText);
      
      setProcessingAI(false);
    }, 1500);
  };

  // Mock AI processing function
  const processWithAI = (text: string, action: string): string => {
    // In a real app, this would call an AI API
    switch (action) {
      case 'summarize':
        return `<p><strong>Summary:</strong> ${text.substring(0, text.length / 3)}...</p>`;
      case 'expand':
        return `<p>${text}</p><p>Furthermore, this concept can be expanded to include additional aspects such as cultural context, practical applications, and historical significance. Considering these dimensions provides a more comprehensive understanding of the topic.</p>`;
      case 'simplify':
        return text.split('.').map(s => s.trim()).filter(s => s.length > 0).map(s => `<p>${s}.</p>`).join('');
      case 'correct':
        return `<p>${text.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\s\s+/g, ' ')}</p>`;
      case 'academic':
        return `<p>It can be substantiated that ${text.toLowerCase().replace(/i /g, 'one ')} This perspective is corroborated by numerous scholarly sources.</p>`;
      case 'creative':
        return `<p>Imagine this: ${text} This vivid scenario invites us to consider the possibilities and implications of such a concept.</p>`;
      default:
        return text;
    }
  };

  const handleNoteContentChange = (content: string) => {
    setNoteContent(content);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold gradient-heading mb-2">AI-Powered Note Editor</h1>
        <p className="text-gray-600">
          Take notes with AI assistance to expand, summarize, and enhance your content
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <motion.div 
          className="lg:col-span-5 bg-white rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-medium bg-transparent border-none focus:outline-none focus:ring-0 w-full"
              placeholder="Note Title"
            />
            <div className="flex space-x-2">
              <button 
                onClick={copyContent}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                title="Copy content"
              >
                {copied ? <CheckCheck size={20} /> : <Copy size={20} />}
              </button>
              <button 
                onClick={saveNote}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                title="Save note"
              >
                {saving ? <Clock className="animate-spin" size={20} /> : <Save size={20} />}
              </button>
            </div>
          </div>
          
          <div className="min-h-[600px]">
            <RichTextEditor 
              initialValue={noteContent}
              onChange={handleNoteContentChange}
              placeholder="Write your notes here..."
              className="h-full"
            />
          </div>
        </motion.div>

        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Wand size={18} className="mr-2 text-purple-600" />
              AI Enhancements
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select text in the editor, then choose an AI action to enhance your notes.
            </p>
            
            <div className="space-y-3">
              {aiOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleAIAction(option.id)}
                  disabled={processingAI}
                  className={`w-full flex items-center p-3 rounded-lg border border-gray-200 
                    ${processingAI ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-purple-50 hover:border-purple-200 transition-colors'}`}
                >
                  <div className="bg-purple-100 p-2 rounded-lg text-purple-600 mr-3">
                    {option.icon}
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900">{option.label}</h4>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {processingAI && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg flex items-center justify-center text-purple-700">
                <Clock className="animate-spin mr-2" size={18} />
                <span>Processing with AI...</span>
              </div>
            )}

            {selectedText && !processingAI && aiResult && (
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                <h4 className="text-sm font-medium text-indigo-800 mb-2">AI Enhancement Applied</h4>
                <p className="text-xs text-indigo-600">Enhancement has been inserted in the editor</p>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Tips for Note-Taking</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-600 p-1 rounded mr-2 inline-block">•</span>
                <span>Use <strong>bold</strong> and <em>italic</em> for emphasis</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-600 p-1 rounded mr-2 inline-block">•</span>
                <span>Use <span className="bg-yellow-200">highlighting</span> for important information</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-600 p-1 rounded mr-2 inline-block">•</span>
                <span>Select text and try the <strong>Summarize</strong> tool to condense long passages</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-600 p-1 rounded mr-2 inline-block">•</span>
                <span>Use the <strong>Simplify</strong> option for complex topics</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-600 p-1 rounded mr-2 inline-block">•</span>
                <span>Save your notes regularly with the save button</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NoteEditor;
