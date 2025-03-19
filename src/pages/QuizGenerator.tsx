import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Bookmark, Check, CircleAlert, CircleHelp, Clock, Copy, Download, FileQuestion, Save, Settings } from 'lucide-react';
import { aiService } from '../services/aiService';

const QuizGenerator = () => {
  const [formData, setFormData] = useState({
    topic: '',
    level: 'intermediate',
    questionCount: 5,
    questionTypes: ['multiple-choice', 'fill-in-blank'],
    timeLimit: 15,
    subjectArea: 'general',
  });
  
  const [generating, setGenerating] = useState(false);
  const [quiz, setQuiz] = useState<null | QuizType>(null);
  const [error, setError] = useState<string | null>(null);

  type Question = {
    id: number;
    type: string;
    text: string;
    options?: string[];
    correctAnswer: string | number;
    difficulty: 'easy' | 'medium' | 'hard';
    explanation: string;
    skills?: string[];
  }

  type QuizType = {
    title: string;
    description: string;
    level: string;
    timeLimit: number;
    questions: Question[];
    objectives?: string[];
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'questionCount' || name === 'timeLimit' ? parseInt(value) : value
    }));
  };

  const handleCheckboxChange = (type: string) => {
    setFormData(prev => {
      const types = [...prev.questionTypes];
      if (types.includes(type)) {
        return { ...prev, questionTypes: types.filter(t => t !== type) };
      } else {
        return { ...prev, questionTypes: [...types, type] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic || !formData.level || formData.questionTypes.length === 0) return;
    
    setGenerating(true);
    setError(null);
    
    try {
      // Check if AI is configured
      if (!aiService.isConfigured()) {
        // Use mock data instead of real API when not configured
        generateEducationalQuiz();
        return;
      }

      // Try to generate a quiz using the AI service
      const result = await aiService.generateQuiz(
        formData.topic,
        formData.level,
        formData.questionCount,
        formData.questionTypes,
        formData.timeLimit
      );
      
      setQuiz(result);
    } catch (error) {
      console.error('Quiz generation error:', error);
      setError('Failed to generate quiz. Please check your API configuration and try again.');
      generateEducationalQuiz(); // Fallback to mock data
    } finally {
      setGenerating(false);
    }
  };

  // Generate realistic educational quiz data that actually tests language knowledge
  const generateEducationalQuiz = () => {
    // Language teaching question templates based on common ESL/EFL formats
    const createQuestionBankForTopic = () => {
      // Extract key terms for the topic to use in questions
      const topicWords = formData.topic.split(' ');
      const mainTopic = topicWords[0] || 'English';
      
      // Grammar-focused question templates
      const grammarQuestions = {
        'tenses': {
          'questions': [
            'Choose the correct form of the verb to complete the sentence: "She _____ to the store yesterday."',
            'Which tense is used in the following sentence: "I have been studying English for five years."',
            'Select the correct verb form: "By the time we arrived, the movie _____ already."',
            'Identify the tense used in: "This time tomorrow, I will be flying to London."',
            'Which form correctly completes this sentence: "If I _____ rich, I would buy a big house."'
          ],
          'options': [
            ['go', 'goes', 'went', 'has gone'],
            ['Present Perfect Progressive', 'Past Simple', 'Present Perfect', 'Future Perfect'],
            ['started', 'has started', 'had started', 'would start'],
            ['Future Continuous', 'Present Continuous', 'Future Perfect', 'Present Perfect Continuous'],
            ['am', 'was', 'were', 'would be']
          ],
          'answers': [2, 0, 2, 0, 2],
          'explanations': [
            'The sentence requires the past simple tense "went" because of the time marker "yesterday."',
            'The sentence "I have been studying English for five years" uses the Present Perfect Progressive tense, which shows an action that started in the past and continues to the present.',
            'The sentence requires the past perfect tense "had started" to indicate an action completed before another past action.',
            'The phrase "This time tomorrow" indicates a future action in progress, requiring the Future Continuous tense.',
            'In second conditional sentences (hypothetical present/future), we use "were" for all persons after "if".'
          ]
        },
        'vocabulary': {
          'questions': [
            'Which word best completes this sentence: "The professor gave a _____ lecture on climate change."',
            'Choose the synonym for "ubiquitous":',
            'What is the meaning of the idiom "to beat around the bush"?',
            'Select the word that does NOT belong in this group:',
            'Which collocation is correct?'
          ],
          'options': [
            ['fascinating', 'fascinated', 'fascinate', 'fascination'],
            ['rare', 'widespread', 'unique', 'special'],
            ['to physically attack a shrub', 'to avoid the main topic', 'to win easily', 'to go hiking'],
            ['jubilant', 'ecstatic', 'elated', 'depressed'],
            ['make a decision', 'do a decision', 'take a decision', 'have a decision']
          ],
          'answers': [0, 1, 1, 3, 0],
          'explanations': [
            '"Fascinating" is the correct adjective to describe an interesting lecture. "Fascinated" describes a person\'s feeling, "fascinate" is a verb, and "fascination" is a noun.',
            '"Ubiquitous" means appearing everywhere or being very common, making "widespread" the closest synonym.',
            'The idiom "to beat around the bush" means to avoid discussing the main topic or the point of a conversation, often by talking about unrelated issues.',
            '"Depressed" means sad or despondent, while all the other words describe states of extreme happiness or joy.',
            'In English, we "make a decision" - this is the correct collocation. The other combinations are not standard in English.'
          ]
        },
        'reading': {
          'questions': [
            'Read the passage and answer: What is the main idea of the text?',
            'According to the passage, why did the author decide to learn a second language?',
            'Which of these statements can be inferred from the text?',
            'What does the word "proficiency" mean in the context of the passage?',
            'What type of text is this most likely to be?'
          ],
          'options': [
            ['The difficulty of learning languages', 'The benefits of bilingualism', 'The history of language education', 'Problems with language learning apps'],
            ['To advance professionally', 'To communicate with family members', 'To travel more easily', 'To appreciate literature in its original form'],
            ['Language learning becomes more difficult with age', 'Children learn languages faster than adults', 'Language immersion is the only effective method', 'Grammar study is unnecessary for fluency'],
            ['Interest or enjoyment', 'Skill or competence', 'Progress or advancement', 'Teaching or instruction'],
            ['A personal blog post', 'An academic research paper', 'A news article', 'A language textbook introduction']
          ],
          'answers': [1, 0, 1, 1, 0],
          'explanations': [
            'The passage primarily discusses how knowing multiple languages offers cognitive, cultural, and professional advantages - making "The benefits of bilingualism" the main idea.',
            'The author explicitly mentions that learning a second language was motivated by career advancement opportunities in paragraph 2.',
            'While not directly stated, the text provides examples of children\'s language acquisition that support the inference that children learn languages faster than adults.',
            'In the context of language learning, "proficiency" refers to the level of skill or competence one has achieved in using the language.',
            'The informal tone, first-person perspective, and personal anecdotes suggest this is from a personal blog post rather than a formal academic or news piece.'
          ]
        }
      };
      
      // Choose the most relevant question bank based on topic and subject area
      let relevantBank;
      if (formData.topic.toLowerCase().includes('tense') || 
          formData.topic.toLowerCase().includes('verb') || 
          formData.topic.toLowerCase().includes('grammar')) {
        relevantBank = grammarQuestions['tenses'];
      } else if (formData.topic.toLowerCase().includes('vocabulary') || 
                formData.topic.toLowerCase().includes('word') || 
                formData.topic.toLowerCase().includes('idiom')) {
        relevantBank = grammarQuestions['vocabulary'];
      } else if (formData.topic.toLowerCase().includes('reading') || 
                formData.topic.toLowerCase().includes('comprehension') || 
                formData.topic.toLowerCase().includes('passage')) {
        relevantBank = grammarQuestions['reading'];
      } else {
        // Default to vocabulary for unknown topics
        relevantBank = grammarQuestions['vocabulary'];
      }
      
      return relevantBank;
    };

    // Create fill-in-the-blank exercises based on topic
    const createFillInBlankExercises = () => {
      // Realistic language exercises based on common patterns
      const fillInBlankTemplates = {
        'grammar': [
          `Complete the sentence with the correct form of the verb: "If it _____ (rain) tomorrow, we will cancel the picnic."`,
          `Fill in the blank with the appropriate modal verb: "You _____ wear a helmet when riding a bicycle for safety."`,
          `Complete the sentence with the correct preposition: "The book is _____ the table."`,
          `Use the correct article: "She bought _____ new dress for the party."`,
          `Fill in the correct form of the comparative adjective: "This exercise is _____ (difficult) than the previous one."`
        ],
        'vocabulary': [
          `Complete the sentence with a suitable word: "The doctor prescribed _____ for my headache."`,
          `Fill in the blank with an appropriate synonym for "big": "The elephant is a _____ animal."`,
          `Complete the collocation: "make a _____" (something you create or decide)`,
          `Add the missing word in this fixed expression: "It's _____ or never."`,
          `Complete the idiom: "To be in hot _____." (meaning to be in trouble)`
        ]
      };
      
      // Choose templates based on topic
      let selectedTemplates;
      if (formData.topic.toLowerCase().includes('grammar') || 
          formData.topic.toLowerCase().includes('tense') || 
          formData.topic.toLowerCase().includes('verb')) {
        selectedTemplates = fillInBlankTemplates['grammar'];
      } else {
        selectedTemplates = fillInBlankTemplates['vocabulary'];
      }
      
      // Corresponding answers
      const answers = {
        'grammar': ['rains', 'should', 'on', 'a', 'more difficult'],
        'vocabulary': ['medication', 'huge', 'decision', 'now', 'water']
      };
      
      // Explanations
      const explanations = {
        'grammar': [
          `In first conditional sentences (possible future condition), we use present simple after "if" and will + infinitive in the main clause.`,
          `"Should" expresses recommendation or advice, which is appropriate for safety guidelines.`,
          `"On" is the correct preposition to indicate that something is positioned on the surface of something else.`,
          `We use the indefinite article "a" before singular countable nouns when mentioning them for the first time.`,
          `To form the comparative of adjectives with two or more syllables, we typically use "more" before the adjective.`
        ],
        'vocabulary': [
          `"Medication" is the appropriate term for medicine prescribed by a doctor.`,
          `"Huge" is a synonym for "big" and correctly describes the size of an elephant.`,
          `The collocation "make a decision" is a standard expression for the act of deciding something.`,
          `The fixed expression "It's now or never" indicates that something must be done immediately or not at all.`,
          `The idiom "to be in hot water" means to be in trouble or a difficult situation.`
        ]
      };
      
      return {
        templates: selectedTemplates,
        answers: answers[formData.topic.toLowerCase().includes('grammar') ? 'grammar' : 'vocabulary'],
        explanations: explanations[formData.topic.toLowerCase().includes('grammar') ? 'grammar' : 'vocabulary']
      };
    };

    // Create true/false questions that actually test language knowledge
    const createTrueFalseQuestions = () => {
      const trueFalseQuestions = [
        {
          question: `In English, we can use the present continuous tense to talk about future arrangements.`,
          answer: "True",
          explanation: `The present continuous can indeed be used to express planned future actions, especially when they are arrangements. For example: "I'm meeting John tomorrow."`
        },
        {
          question: `The words "affect" and "effect" have the same meaning and can be used interchangeably.`,
          answer: "False",
          explanation: `"Affect" is typically a verb meaning to influence something, while "effect" is typically a noun referring to the result of an action. They have different meanings and uses.`
        },
        {
          question: `In academic English writing, it's best to use contractions like "don't" and "can't" to sound more natural.`,
          answer: "False",
          explanation: `In formal academic writing, contractions are generally avoided. Full forms (do not, cannot) are preferred for a more formal tone.`
        },
        {
          question: `The suffix "-tion" is commonly used to form nouns from verbs in English.`,
          answer: "True",
          explanation: `The suffix "-tion" is indeed commonly used to transform verbs into nouns, as in: create → creation, educate → education, inform → information.`
        },
        {
          question: `In English conditionals, we always use "would" in the main clause of second conditional sentences.`,
          answer: "True",
          explanation: `In second conditional sentences (hypothetical present/future), we typically use "would" in the main clause. Example: "If I had more time, I would learn Chinese."`
        }
      ];
      
      return trueFalseQuestions;
    };

    // Select the right question bank based on topic
    const questionBank = createQuestionBankForTopic();
    const fillBlankExercises = createFillInBlankExercises();
    const trueFalseQuestions = createTrueFalseQuestions();
    
    // Create questions based on selected types
    const mockQuestions: Question[] = [];
    let questionIndex = 0;
    
    // Function to determine difficulty based on level and question index
    const getDifficulty = (index: number): 'easy' | 'medium' | 'hard' => {
      switch (formData.level) {
        case 'beginner':
          return index < 3 ? 'easy' : index < 4 ? 'medium' : 'hard';
        case 'intermediate':
          return index < 2 ? 'easy' : index < 4 ? 'medium' : 'hard';
        case 'advanced':
          return index < 1 ? 'easy' : index < 3 ? 'medium' : 'hard';
        default:
          return 'medium';
      }
    };
    
    // Create questions up to the requested count
    while (mockQuestions.length < formData.questionCount) {
      const types = formData.questionTypes.length > 0 ? formData.questionTypes : ['multiple-choice'];
      const currentType = types[mockQuestions.length % types.length];
      const difficulty = getDifficulty(mockQuestions.length);
      
      if (currentType === 'multiple-choice' && questionIndex < questionBank.questions.length) {
        // Add multiple choice question
        mockQuestions.push({
          id: mockQuestions.length + 1,
          type: 'multiple-choice',
          text: questionBank.questions[questionIndex],
          options: questionBank.options[questionIndex],
          correctAnswer: questionBank.answers[questionIndex],
          difficulty: difficulty,
          explanation: questionBank.explanations[questionIndex],
          skills: ['Reading comprehension', 'Grammar analysis', 'Vocabulary knowledge']
        });
      } else if (currentType === 'fill-in-blank' && questionIndex < fillBlankExercises.templates.length) {
        // Add fill-in-blank question
        mockQuestions.push({
          id: mockQuestions.length + 1,
          type: 'fill-in-blank',
          text: fillBlankExercises.templates[questionIndex],
          correctAnswer: fillBlankExercises.answers[questionIndex],
          difficulty: difficulty,
          explanation: fillBlankExercises.explanations[questionIndex],
          skills: ['Vocabulary', 'Grammar application', 'Language patterns']
        });
      } else if (currentType === 'true-false' && questionIndex < trueFalseQuestions.length) {
        // Add true-false question
        mockQuestions.push({
          id: mockQuestions.length + 1,
          type: 'true-false',
          text: trueFalseQuestions[questionIndex].question,
          correctAnswer: trueFalseQuestions[questionIndex].answer,
          difficulty: difficulty,
          explanation: trueFalseQuestions[questionIndex].explanation,
          skills: ['Critical thinking', 'Language rules knowledge', 'Reading comprehension']
        });
      } else if (currentType === 'matching') {
        // Create a simple matching exercise
        mockQuestions.push({
          id: mockQuestions.length + 1,
          type: 'matching',
          text: 'Match these words with their definitions:',
          options: ['Ambiguous', 'Concise', 'Redundant', 'Pragmatic'],
          correctAnswer: 'A=2, B=0, C=3, D=1',
          difficulty: difficulty,
          explanation: 'Ambiguous means unclear or having multiple interpretations. Concise means brief but comprehensive. Redundant means unnecessary or superfluous. Pragmatic means practical or focused on facts.',
          skills: ['Vocabulary', 'Reading comprehension', 'Word-definition pairing']
        });
      }
      
      // Increment question index, loop back to beginning if needed
      questionIndex = (questionIndex + 1) % 5;
      
      // Break if we've reached the desired question count
      if (mockQuestions.length >= formData.questionCount) {
        break;
      }
    }
    
    // Create quiz title and description based on topic and level
    const levelDescriptors = {
      'beginner': 'foundational skills in',
      'intermediate': 'applied knowledge of',
      'advanced': 'advanced mastery of'
    };
    
    const levelDesc = levelDescriptors[formData.level as keyof typeof levelDescriptors] || 'understanding of';
    
    // Create educational objectives based on level and content
    const createObjectives = (): string[] => {
      const skillObjectives = [
        `Assess ${levelDesc} ${formData.topic} concepts and terminology`,
        `Evaluate ability to apply ${formData.topic} principles in context`,
        `Test comprehension of key ${formData.topic} structures and patterns`
      ];
      
      // Add level-specific objectives
      if (formData.level === 'beginner') {
        skillObjectives.push(`Build confidence with basic ${formData.topic} concepts`);
      } else if (formData.level === 'intermediate') {
        skillObjectives.push(`Strengthen analytical skills related to ${formData.topic}`);
      } else if (formData.level === 'advanced') {
        skillObjectives.push(`Challenge critical thinking through complex ${formData.topic} scenarios`);
      }
      
      return skillObjectives;
    };
    
    // Create quiz object
    const mockQuiz: QuizType = {
      title: `${formData.topic} Assessment`,
      description: `This quiz evaluates ${levelDesc} ${formData.topic} with a focus on practical language application.`,
      level: formData.level,
      timeLimit: formData.timeLimit,
      questions: mockQuestions,
      objectives: createObjectives()
    };
    
    setQuiz(mockQuiz);
    setGenerating(false);
  };

  const levelOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'fill-in-blank', label: 'Fill in the Blank' },
    { value: 'true-false', label: 'True/False' },
    { value: 'matching', label: 'Matching' }
  ];

  const subjectAreas = [
    { value: 'general', label: 'General English' },
    { value: 'grammar', label: 'Grammar' },
    { value: 'vocabulary', label: 'Vocabulary' },
    { value: 'reading', label: 'Reading Comprehension' },
    { value: 'writing', label: 'Writing' },
    { value: 'speaking', label: 'Speaking' }
  ];

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Easy</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Medium</span>;
      case 'hard':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Hard</span>;
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
        <h1 className="text-3xl font-bold gradient-heading mb-2">Adaptive Quiz Generator</h1>
        <p className="text-gray-600">
          Create customized quizzes to evaluate understanding and adapt to different proficiency levels
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
                Quiz Topic
              </label>
              <input
                id="topic"
                name="topic"
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Modal Verbs, Passive Voice"
                value={formData.topic}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                  Proficiency Level
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
                <label htmlFor="subjectArea" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Area
                </label>
                <select
                  id="subjectArea"
                  name="subjectArea"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.subjectArea}
                  onChange={handleInputChange}
                >
                  {subjectAreas.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="questionCount" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Questions
              </label>
              <input
                id="questionCount"
                name="questionCount"
                type="number"
                min="1"
                max="20"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.questionCount}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Types
              </label>
              <div className="grid grid-cols-2 gap-2">
                {questionTypes.map(type => (
                  <div key={type.value} className="flex items-center">
                    <input
                      id={`type-${type.value}`}
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      checked={formData.questionTypes.includes(type.value)}
                      onChange={() => handleCheckboxChange(type.value)}
                    />
                    <label htmlFor={`type-${type.value}`} className="ml-2 text-sm text-gray-700">
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-1">
                Time Limit (minutes)
              </label>
              <input
                id="timeLimit"
                name="timeLimit"
                type="number"
                min="1"
                max="60"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.timeLimit}
                onChange={handleInputChange}
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg text-red-700 flex items-start">
                <CircleAlert size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={generating || !formData.topic || !formData.level || formData.questionTypes.length === 0}
              className={`w-full px-6 py-3 rounded-lg font-medium text-white 
                ${generating || !formData.topic || !formData.level || formData.questionTypes.length === 0
                  ? 'bg-gray-400' 
                  : 'bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 button-glow'
                } transition-all`}
            >
              {generating ? (
                <span className="flex items-center justify-center">
                  <Clock className="animate-spin mr-2" size={18} />
                  Generating Quiz...
                </span>
              ) : 'Generate Quiz'}
            </button>
          </form>
        </motion.div>

        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {quiz ? (
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{quiz.title}</h2>
                  <p className="text-sm text-gray-600">{quiz.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Save quiz"
                  >
                    <Save size={20} />
                  </button>
                  <button 
                    className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Download quiz"
                  >
                    <Download size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                  <Award size={14} className="mr-1" />
                  Level: {quiz.level}
                </div>
                <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center">
                  <Clock size={14} className="mr-1" />
                  {quiz.timeLimit} minutes
                </div>
                <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center">
                  <FileQuestion size={14} className="mr-1" />
                  {quiz.questions.length} Questions
                </div>
              </div>
              
              {quiz.objectives && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                    <Bookmark size={16} className="mr-1" />
                    Learning Objectives
                  </h3>
                  <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                    {quiz.objectives.map((objective, idx) => (
                      <li key={idx}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                {quiz.questions.map((question, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <span className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-800 rounded-full mr-2 font-medium">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-xs uppercase text-gray-500 font-medium">{question.type}</span>
                          {question.skills && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {question.skills.map((skill, skillIdx) => (
                                <span key={skillIdx} className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {getDifficultyBadge(question.difficulty)}
                      </div>
                    </div>
                    
                    <p className="text-gray-800 mb-3 font-medium">{question.text}</p>
                    
                    {question.type === 'multiple-choice' && question.options && (
                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optIdx) => (
                          <div 
                            key={optIdx} 
                            className={`p-3 rounded-lg border ${
                              optIdx === question.correctAnswer 
                                ? 'border-green-200 bg-green-50'
                                : 'border-gray-200 hover:bg-gray-100'
                            } cursor-pointer transition-colors`}
                          >
                            <div className="flex items-center">
                              <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 mr-2 flex-shrink-0">
                                {optIdx === question.correctAnswer ? (
                                  <Check size={14} className="text-green-600" />
                                ) : (
                                  <span className="text-sm text-gray-600">{String.fromCharCode(65 + optIdx)}</span>
                                )}
                              </div>
                              <span className={optIdx === question.correctAnswer ? 'text-green-700' : 'text-gray-700'}>
                                {option}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.type === 'fill-in-blank' && (
                      <div className="mb-4">
                        <div className="p-3 rounded-lg border border-green-200 bg-green-50">
                          <div className="flex items-center">
                            <Check size={16} className="text-green-600 mr-2 flex-shrink-0" />
                            <div>
                              <span className="text-xs font-medium text-green-700 block">Correct Answer</span>
                              <span className="text-green-800 font-medium">{question.correctAnswer}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {question.type === 'true-false' && (
                      <div className="mb-4 flex space-x-3">
                        <div 
                          className={`flex-1 p-3 rounded-lg border ${
                            question.correctAnswer === 'True' 
                              ? 'border-green-200 bg-green-50' 
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>True</span>
                            {question.correctAnswer === 'True' && (
                              <Check size={16} className="text-green-600" />
                            )}
                          </div>
                        </div>
                        <div 
                          className={`flex-1 p-3 rounded-lg border ${
                            question.correctAnswer === 'False' 
                              ? 'border-green-200 bg-green-50' 
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>False</span>
                            {question.correctAnswer === 'False' && (
                              <Check size={16} className="text-green-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {question.type === 'matching' && (
                      <div className="mb-4">
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="p-2 bg-indigo-50 rounded border border-indigo-100">
                            <span className="block text-xs text-indigo-700 mb-1">Items to match:</span>
                            {question.options && question.options.map((item, i) => (
                              <div key={i} className="flex items-center mb-1 last:mb-0">
                                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 mr-2 text-xs">
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <span className="text-sm">{item}</span>
                              </div>
                            ))}
                          </div>
                          <div className="p-2 bg-orange-50 rounded border border-orange-100">
                            <span className="block text-xs text-orange-700 mb-1">Correct matches:</span>
                            <p className="text-sm text-orange-800">{question.correctAnswer}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-indigo-50 p-3 rounded-lg flex items-start">
                      <CircleHelp size={16} className="text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-indigo-800 block mb-1">Explanation</span>
                        <p className="text-sm text-indigo-900">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
                  <Copy size={16} className="mr-1.5" />
                  Copy Quiz
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 button-glow flex items-center">
                  <Download size={16} className="mr-1.5" />
                  Export Quiz
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col items-center justify-center text-center">
              <div className="bg-amber-100 p-4 rounded-full mb-4">
                <FileQuestion size={32} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create Your Custom Quiz</h3>
              <p className="text-gray-600 mb-6">
                Fill out the form on the left to generate an adaptive quiz based on your specifications.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg w-full text-left">
                <h4 className="font-medium text-gray-800 mb-2 text-sm">Quiz features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Multiple question types to test different skills</li>
                  <li>• Difficulty levels that adapt to student needs</li>
                  <li>• Detailed explanations for correct answers</li>
                  <li>• Questions that promote critical thinking</li>
                  <li>• Export and sharing options for classroom use</li>
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuizGenerator;
