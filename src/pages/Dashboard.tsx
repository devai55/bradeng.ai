import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, FileQuestion, Lightbulb, MessageSquare, PenTool } from 'lucide-react';

const Dashboard = () => {
  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const modules = [
    {
      title: 'AI Feedback System',
      description: 'Get detailed feedback on English writing with grammar, vocabulary, and style analysis.',
      icon: <MessageSquare size={24} />,
      path: '/feedback',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Lesson Plan Generator',
      description: 'Create structured and adaptable lesson plans based on defined parameters.',
      icon: <BookOpen size={24} />,
      path: '/lesson-plans',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Adaptive Quiz Generator',
      description: 'Generate quizzes that evaluate understanding and adapt to proficiency levels.',
      icon: <FileQuestion size={24} />,
      path: '/quizzes',
      color: 'from-amber-500 to-orange-600'
    },
    {
      title: 'Note Editor with AI',
      description: 'Take notes with AI assistance to expand, summarize, and enhance content.',
      icon: <PenTool size={24} />,
      path: '/notes',
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Content Enhancer',
      description: 'Modify text resources to match specific needs and proficiency levels.',
      icon: <Lightbulb size={24} />,
      path: '/content-enhancer',
      color: 'from-rose-500 to-red-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold gradient-heading mb-2">
          Welcome to TeachMaster AI
        </h1>
        <p className="text-lg text-gray-600">
          Your comprehensive English language teaching and learning assistant
        </p>
      </motion.div>

      {/* Modules */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {modules.map((module, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 card-hover"
          >
            <div className={`h-2 bg-gradient-to-r ${module.color}`}></div>
            <div className="p-5">
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${module.color} text-white mb-4`}>
                {module.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
              <p className="text-gray-600 mb-4">{module.description}</p>
              <Link
                to={module.path}
                className="inline-flex items-center font-medium text-indigo-600 hover:text-indigo-500"
              >
                Get started
                <svg className="ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Dashboard;
