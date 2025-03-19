interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: MessageContent[];
}

type MessageContent = TextContent | ImageContent;

interface TextContent {
  type: 'text';
  text: string;
}

interface ImageContent {
  type: 'image_url';
  image_url: {
    url: string;
  };
}

interface AICompletionRequest {
  model: string;
  messages: AIMessage[];
}

interface AICompletionResponse {
  id: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

/**
 * Service for AI-related operations
 */
export const aiService = {
  /**
   * Get the API key from local storage
   */
  getApiKey: (): string => {
    return localStorage.getItem('openrouter_api_key') || '';
  },

  /**
   * Set the API key in local storage
   */
  setApiKey: (apiKey: string): void => {
    localStorage.setItem('openrouter_api_key', apiKey);
  },

  /**
   * Get the internal model identifier (not exposed to users)
   */
  getModel: (): string => {
    // Default model set internally - not exposed in UI
    return localStorage.getItem('ai_model') || 'google/gemini-2.0-pro-exp-02-05:free';
  },

  /**
   * Set the model in local storage
   */
  setModel: (model: string): void => {
    // This method is kept for internal use, not exposed in UI
    localStorage.setItem('ai_model', model);
  },

  /**
   * Check if API configuration is valid
   */
  isConfigured: (): boolean => {
    const apiKey = localStorage.getItem('openrouter_api_key');
    return apiKey !== null && apiKey.trim() !== '';
  },

  /**
   * Generate AI response
   */
  generateCompletion: async (
    prompt: string,
    imageUrl?: string
  ): Promise<string> => {
    const apiKey = localStorage.getItem('openrouter_api_key');
    const model = localStorage.getItem('ai_model') || 'google/gemini-2.0-pro-exp-02-05:free';
    
    if (!apiKey) {
      throw new Error('API key not configured. Please set your API key in Settings.');
    }

    // Prepare the message content
    const content: MessageContent[] = [{ type: 'text', text: prompt }];
    
    // Add image if provided
    if (imageUrl) {
      content.push({
        type: 'image_url',
        image_url: { url: imageUrl }
      });
    }

    const requestData: AICompletionRequest = {
      model,
      messages: [
        {
          role: 'user',
          content
        }
      ]
    };

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'TeachMaster AI',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get AI response');
      }

      const data: AICompletionResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('AI generation error:', error);
      throw error;
    }
  },
  
  /**
   * Generate enhanced content for teaching materials
   */
  enhanceContent: async (
    text: string,
    enhancementType: string,
    targetLevel: string
  ): Promise<string> => {
    const prompt = `
      Enhance the following educational content:
      - Enhancement type: ${enhancementType}
      - Target language level: ${targetLevel}
      
      Original content:
      ${text}
      
      Please provide the enhanced version only, without any additional comments.
    `;
    
    return aiService.generateCompletion(prompt);
  },
  
  /**
   * Generate feedback for student writing
   */
  generateFeedback: async (text: string): Promise<any> => {
    const prompt = `
      Analyze the following English text and provide detailed feedback:
      ${text}
      
      Format your response as a JSON object with these properties:
      - overallScore (number from 0-100)
      - strengths (array of strings)
      - summary (string with overall feedback)
      - details (object with scores for grammar, vocabulary, structure, coherence, and style)
      - items (array of specific feedback items, each with type, severity, issue, location, suggestion, and explanation)
      
      Provide the JSON object only, without any additional comments.
    `;
    
    const response = await aiService.generateCompletion(prompt);
    
    // Try to parse the JSON response
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI feedback response:', error);
      throw new Error('Invalid response format from AI service');
    }
  },
  
  /**
   * Generate a lesson plan based on parameters
   */
  generateLessonPlan: async (
    topic: string,
    level: string,
    outcomes: string,
    duration: number
  ): Promise<any> => {
    const prompt = `
      Create a detailed lesson plan with the following parameters:
      - Topic: ${topic}
      - Proficiency level: ${level}
      - Learning outcomes: ${outcomes}
      - Duration: ${duration} minutes
      
      Format your response as a JSON object with these properties:
      - title (string)
      - level (string)
      - duration (number)
      - objectives (array of strings)
      - activities (array of activity objects, each with name, type, duration, description, and materials)
      - assessment (string)
      - differentiation (object with strategies for struggling and advanced students)
      - materials (array of strings)
      - reflection (array of strings with reflection questions)
      
      Provide the JSON object only, without any additional comments.
    `;
    
    const response = await aiService.generateCompletion(prompt);
    
    // Try to parse the JSON response
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse AI lesson plan response:', error);
      throw new Error('Invalid response format from AI service');
    }
  },
  
  /**
   * Generate a quiz based on parameters
   */
  generateQuiz: async (
    topic: string,
    level: string,
    questionCount: number,
    questionTypes: string[],
    timeLimit: number
  ): Promise<any> => {
    // Create a detailed prompt specifying the exact format needed
    const prompt = `
      You are an expert language teacher. Create an educational quiz on "${topic}" for ${level} level English learners.
      
      The quiz should have ${questionCount} questions, with a time limit of ${timeLimit} minutes.
      Include question types: ${questionTypes.join(', ')}.
      
      Create realistic, educational assessment questions that test actual language knowledge and skills.
      For multiple-choice questions, include plausible distractors that reflect common misconceptions.
      
      Format your response as a JSON object exactly like this:
      {
        "title": "Quiz title related to the topic",
        "description": "Brief description of what this quiz assesses",
        "level": "${level}",
        "timeLimit": ${timeLimit},
        "questions": [
          {
            "id": 1,
            "type": "multiple-choice",
            "text": "Question text here",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "difficulty": "medium",
            "explanation": "Detailed explanation of why this answer is correct",
            "skills": ["Skill being tested", "Another skill"]
          },
          {
            "id": 2,
            "type": "fill-in-blank",
            "text": "Text with a ____ to fill in",
            "correctAnswer": "correct word",
            "difficulty": "easy",
            "explanation": "Explanation of the answer",
            "skills": ["Vocabulary", "Grammar"]
          }
        ],
        "objectives": ["Learning objective 1", "Learning objective 2", "Learning objective 3"]
      }
      
      For each question:
      - Ensure text is clear and appropriate for ${level} level
      - For "multiple-choice" questions, provide realistic options with only one correct answer (indicated by index 0-3)
      - For "fill-in-blank" questions, use underscores to indicate blanks and provide the exact answer
      - For "true-false" questions, make correctAnswer either "True" or "False"
      - Vary difficulty across "easy", "medium", and "hard" based on the ${level} level
      - Provide educational explanations that teach the concept
      - List 1-3 skills being tested (e.g., "Vocabulary", "Reading Comprehension", "Grammar")
      
      Most importantly, create REALISTIC educational questions suitable for actual language learning assessment. Do not generate nonsensical, trivial, or overly simplified questions.
      
      Return ONLY the JSON object without any additional text or markdown.
    `;
    
    try {
      const response = await aiService.generateCompletion(prompt);
      
      // Try to parse the JSON response
      try {
        return JSON.parse(response);
      } catch (error) {
        console.error('Failed to parse AI quiz response:', error);
        throw new Error('Invalid response format from AI service');
      }
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      throw error;
    }
  }
};

export default aiService;
