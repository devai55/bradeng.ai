import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCheck, Clock, Copy, Download } from 'lucide-react';

const LessonGenerator = () => {
  const [formData, setFormData] = useState({
    topic: '',
    level: '',
    outcomes: '',
    duration: 60,
  });
  
  const [generating, setGenerating] = useState(false);
  const [lessonPlan, setLessonPlan] = useState<null | LessonPlanType>(null);
  const [copied, setCopied] = useState(false);

  type Activity = {
    name: string;
    type: string;
    duration: number;
    description: string;
    materials?: string[];
  };

  type LessonPlanType = {
    title: string;
    level: string;
    duration: number;
    objectives: string[];
    activities: Activity[];
    assessment: string;
    differentiation: {
      struggling: string;
      advanced: string;
    };
    materials: string[];
    reflection: string[];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic || !formData.level) return;
    
    setGenerating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock AI response
      const mockLessonPlan: LessonPlanType = {
        title: `Understanding ${formData.topic}`,
        level: formData.level,
        duration: formData.duration,
        objectives: [
          `Students will be able to identify key elements of ${formData.topic}`,
          `Students will be able to use vocabulary related to ${formData.topic} in context`,
          `Students will be able to discuss ${formData.topic} using appropriate structures`
        ],
        activities: [
          {
            name: 'Warm-up Discussion',
            type: 'warm-up',
            duration: 10,
            description: `Students discuss what they already know about ${formData.topic} in pairs. Then share with the class.`
          },
          {
            name: 'Vocabulary Introduction',
            type: 'presentation',
            duration: 15,
            description: 'Introduce key vocabulary with visual aids and example sentences.',
            materials: ['Vocabulary flashcards', 'Projector']
          },
          {
            name: 'Guided Practice',
            type: 'practice',
            duration: 20,
            description: 'Students complete gap-fill exercises and matching activities using target vocabulary.',
            materials: ['Worksheet', 'Answer key']
          },
          {
            name: 'Group Discussion',
            type: 'production',
            duration: 15,
            description: 'In small groups, students discuss questions related to the topic using target language.',
            materials: ['Discussion prompt cards']
          }
        ],
        assessment: 'Monitor group discussions and collect written work to assess vocabulary usage and comprehension.',
        differentiation: {
          struggling: 'Provide sentence frames and additional visual aids.',
          advanced: 'Encourage use of more complex structures and additional vocabulary.'
        },
        materials: [
          'Vocabulary flashcards',
          'Projector and slides',
          'Handouts with exercises',
          'Discussion prompt cards'
        ],
        reflection: [
          'Were students engaged throughout the lesson?',
          'Did students achieve the stated objectives?',
          'What would I change for next time?'
        ]
      };
      
      setLessonPlan(mockLessonPlan);
      setGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    if (!lessonPlan) return;
    
    let text = `# ${lessonPlan.title}\n\n`;
    text += `Level: ${lessonPlan.level}\n`;
    text += `Duration: ${lessonPlan.duration} minutes\n\n`;
    
    text += `## Objectives\n`;
    lessonPlan.objectives.forEach(obj => {
      text += `- ${obj}\n`;
    });
    text += '\n';
    
    text += `## Activities\n`;
    lessonPlan.activities.forEach(activity => {
      text += `### ${activity.name} (${activity.duration} mins) - ${activity.type}\n`;
      text += `${activity.description}\n`;
      if (activity.materials) {
        text += 'Materials: ' + activity.materials.join(', ') + '\n';
      }
      text += '\n';
    });
    
    text += `## Assessment\n${lessonPlan.assessment}\n\n`;
    
    text += `## Differentiation\n`;
    text += `For struggling students: ${lessonPlan.differentiation.struggling}\n`;
    text += `For advanced students: ${lessonPlan.differentiation.advanced}\n\n`;
    
    text += `## Materials\n`;
    lessonPlan.materials.forEach(material => {
      text += `- ${material}\n`;
    });
    text += '\n';
    
    text += `## Teacher Reflection Questions\n`;
    lessonPlan.reflection.forEach(item => {
      text += `- ${item}\n`;
    });
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const levelOptions = [
    { value: 'A1', label: 'Beginner (A1)' },
    { value: 'A2', label: 'Elementary (A2)' },
    { value: 'B1', label: 'Intermediate (B1)' },
    { value: 'B2', label: 'Upper Intermediate (B2)' },
    { value: 'C1', label: 'Advanced (C1)' },
    { value: 'C2', label: 'Proficiency (C2)' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold gradient-heading mb-2">Dynamic Lesson Plan Generator</h1>
        <p className="text-gray-600">
          Create structured and adaptable lesson plans based on your specific requirements
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                Learning Topic
              </label>
              <input
                id="topic"
                name="topic"
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Past Continuous Tense"
                value={formData.topic}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                Target Proficiency Level
              </label>
              <select
                id="level"
                name="level"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.level}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a level</option>
                {levelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="outcomes" className="block text-sm font-medium text-gray-700 mb-1">
                Desired Learning Outcomes
              </label>
              <textarea
                id="outcomes"
                name="outcomes"
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="What should students be able to do after this lesson?"
                value={formData.outcomes}
                onChange={handleInputChange}
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Lesson Duration (minutes)
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                min="15"
                max="180"
                step="5"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.duration}
                onChange={handleInputChange}
              />
            </div>
            
            <button
              type="submit"
              disabled={generating || !formData.topic || !formData.level}
              className={`w-full px-6 py-3 rounded-lg font-medium text-white 
                ${generating || !formData.topic || !formData.level 
                  ? 'bg-gray-400' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 button-glow'
                } transition-all`}
            >
              {generating ? (
                <span className="flex items-center justify-center">
                  <Clock className="animate-spin mr-2" size={18} />
                  Generating Plan...
                </span>
              ) : 'Generate Lesson Plan'}
            </button>
          </form>
        </motion.div>

        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {lessonPlan ? (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">{lessonPlan.title}</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <CheckCheck size={20} /> : <Copy size={20} />}
                  </button>
                  <button 
                    className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Download as PDF"
                  >
                    <Download size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Level: {lessonPlan.level}
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                  <Clock size={14} className="mr-1" />
                  {lessonPlan.duration} minutes
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Learning Objectives</h3>
                <ul className="space-y-1 list-disc list-inside text-gray-700">
                  {lessonPlan.objectives.map((objective, idx) => (
                    <li key={idx}>{objective}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Lesson Activities</h3>
                <div className="space-y-4">
                  {lessonPlan.activities.map((activity, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{activity.name}</h4>
                        <span className="text-sm text-gray-500">{activity.duration} mins</span>
                      </div>
                      <div className="flex mb-2">
                        <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                          {activity.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
                      {activity.materials && (
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Materials:</span> {activity.materials.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Assessment</h3>
                  <p className="text-sm text-gray-700">{lessonPlan.assessment}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Differentiation</h3>
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">For struggling students:</h4>
                      <p className="text-sm text-gray-700">{lessonPlan.differentiation.struggling}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">For advanced students:</h4>
                      <p className="text-sm text-gray-700">{lessonPlan.differentiation.advanced}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Materials Needed</h3>
                  <ul className="space-y-1 list-disc list-inside text-sm text-gray-700">
                    {lessonPlan.materials.map((material, idx) => (
                      <li key={idx}>{material}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Teacher Reflection</h3>
                  <ul className="space-y-1 list-disc list-inside text-sm text-gray-700">
                    {lessonPlan.reflection.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col items-center justify-center text-center">
              <div className="bg-emerald-100 p-4 rounded-full mb-4">
                <BookOpen size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create Your Lesson Plan</h3>
              <p className="text-gray-600 mb-6">
                Fill out the form on the left to generate a comprehensive lesson plan tailored to your needs.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg w-full text-left">
                <h4 className="font-medium text-gray-800 mb-2 text-sm">Your lesson plan will include:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Clear learning objectives</li>
                  <li>• Sequenced activities with timing</li>
                  <li>• Required materials</li>
                  <li>• Assessment strategies</li>
                  <li>• Differentiation techniques</li>
                  <li>• Teacher reflection prompts</li>
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LessonGenerator;
