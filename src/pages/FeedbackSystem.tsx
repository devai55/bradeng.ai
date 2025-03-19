import { useState } from 'react';
import { motion } from 'framer-motion';
import { CircleAlert, Check, Clock, Info } from 'lucide-react';

const FeedbackSystem = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<null | FeedbackResult>(null);

  type FeedbackItem = {
    type: 'grammar' | 'vocabulary' | 'structure' | 'coherence' | 'style';
    severity: 'high' | 'medium' | 'low';
    issue: string;
    location: { start: number; end: number };
    suggestion: string;
    explanation: string;
  };

  type FeedbackResult = {
    overallScore: number;
    strengths: string[];
    summary: string;
    details: {
      grammar: { score: number; count: number };
      vocabulary: { score: number; count: number };
      structure: { score: number; count: number };
      coherence: { score: number; count: number };
      style: { score: number; count: number };
    };
    items: FeedbackItem[];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock AI response - in a real app, this would come from an API
      const mockFeedback: FeedbackResult = {
        overallScore: 78,
        strengths: [
          'Good use of transitional phrases',
          'Appropriate academic vocabulary',
          'Clear introduction that states the main argument'
        ],
        summary: 'Your writing demonstrates good understanding of the topic with appropriate vocabulary. Focus on improving sentence structure and grammar consistency.',
        details: {
          grammar: { score: 75, count: 4 },
          vocabulary: { score: 85, count: 2 },
          structure: { score: 70, count: 3 },
          coherence: { score: 82, count: 1 },
          style: { score: 78, count: 2 }
        },
        items: [
          {
            type: 'grammar',
            severity: 'high',
            issue: 'Subject-verb agreement error',
            location: { start: 10, end: 25 },
            suggestion: 'The student needs to arrive early',
            explanation: 'When the subject is singular (student), the verb should also be singular (needs instead of need).'
          },
          {
            type: 'structure',
            severity: 'medium',
            issue: 'Run-on sentence',
            location: { start: 80, end: 120 },
            suggestion: 'Split into two sentences or use a semicolon',
            explanation: 'Two independent clauses are joined without proper punctuation or a conjunction.'
          },
          {
            type: 'vocabulary',
            severity: 'low',
            issue: 'Word choice',
            location: { start: 150, end: 158 },
            suggestion: 'Consider using "demonstrate" instead of "show"',
            explanation: 'In academic writing, more precise and formal vocabulary is preferred.'
          }
        ]
      };
      
      setFeedback(mockFeedback);
      setLoading(false);
    }, 1500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">High</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Low</span>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'grammar':
        return <CircleAlert size={16} className="text-red-600" />;
      case 'vocabulary':
        return <Info size={16} className="text-blue-600" />;
      case 'structure':
        return <CircleAlert size={16} className="text-yellow-600" />;
      case 'coherence':
        return <Info size={16} className="text-purple-600" />;
      case 'style':
        return <Info size={16} className="text-indigo-600" />;
      default:
        return null;
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
        <h1 className="text-3xl font-bold gradient-heading mb-2">AI-Powered Feedback System</h1>
        <p className="text-gray-600">
          Submit your English text to receive detailed analysis and improvement suggestions
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div 
          className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-1">
                Enter your text for analysis
              </label>
              <textarea
                id="text-input"
                rows={12}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Paste or type your English text here for feedback and analysis..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {text.length} characters
              </div>
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className={`px-6 py-3 rounded-lg font-medium text-white 
                  ${loading || !text.trim() 
                    ? 'bg-gray-400' 
                    : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 button-glow'
                  } transition-all`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <Clock className="animate-spin mr-2" size={18} />
                    Analyzing...
                  </span>
                ) : 'Analyze Text'}
              </button>
            </div>
          </form>
        </motion.div>

        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {feedback ? (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="mb-6 text-center">
                <div className="inline-block mb-2">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-3xl font-bold ${getScoreColor(feedback.overallScore)}`}>
                        {feedback.overallScore}
                      </span>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={feedback.overallScore >= 85 ? "#059669" : feedback.overallScore >= 70 ? "#d97706" : "#dc2626"}
                        strokeWidth="3"
                        strokeDasharray={`${feedback.overallScore}, 100`}
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900">Overall Score</h3>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                <p className="text-gray-700">{feedback.summary}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(feedback.details).map(([category, { score }]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{category}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${score >= 85 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${getScoreColor(score)}`}>{score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Identified Issues</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {feedback.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          {getTypeIcon(item.type)}
                          <span className="text-sm font-medium capitalize">{item.type}</span>
                        </div>
                        {getSeverityBadge(item.severity)}
                      </div>
                      <p className="text-sm text-gray-800 mb-1">{item.issue}</p>
                      <p className="text-xs text-gray-600 mb-1">Suggestion: {item.suggestion}</p>
                      <p className="text-xs text-gray-500">{item.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col items-center justify-center text-center">
              <div className="bg-indigo-100 p-4 rounded-full mb-4">
                <Check size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for Analysis</h3>
              <p className="text-gray-600 mb-6">
                Enter your text on the left and submit to receive detailed feedback and analysis.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg w-full">
                <h4 className="font-medium text-gray-800 mb-2 text-sm">We analyze:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Grammar & Syntax</li>
                  <li>• Vocabulary Usage</li>
                  <li>• Sentence Structure</li>
                  <li>• Coherence & Organization</li>
                  <li>• Style & Tone</li>
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackSystem;
