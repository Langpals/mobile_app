// data/mockData.ts
import { Season, ProgressStats, ChildProfile, TeddyBear, ProficiencyMetrics } from '@/types';

export const mockSeasons: Season[] = [
  {
    id: 'season-1',
    number: 1,
    title: 'Magic Island Adventures',
    theme: 'Foundational Discovery',
    setting: 'A magical island with different regions (beach, forest, mountain, village)',
    characterRole: 'Bern guides the child as an explorer discovering the island',
    narrativeHook: 'Finding magical objects that reveal new parts of the island',
    description: 'Begin your magical journey with Bern! Explore a wonderful island and discover your first Spanish words through exciting adventures.',
    learningFocus: ['Basic greetings', 'Self-introduction', 'Colors', 'Numbers 1-10', 'Simple objects', 'Basic feelings'],
    learningOutcomes: [
      {
        id: 'greeting-1',
        description: 'Recognize and respond to basic greetings',
        achieved: true,
        category: 'conversation'
      },
      {
        id: 'intro-1',
        description: 'Introduce oneself with "Me llamo..."',
        achieved: true,
        category: 'conversation'
      },
      {
        id: 'objects-1',
        description: 'Identify 20+ common objects by name',
        achieved: false,
        category: 'vocabulary'
      },
      {
        id: 'numbers-1',
        description: 'Count from 1-10',
        achieved: false,
        category: 'vocabulary'
      },
      {
        id: 'colors-1',
        description: 'Recognize and name 8 colors',
        achieved: false,
        category: 'vocabulary'
      },
      {
        id: 'feelings-1',
        description: 'Express basic feelings (happy, sad, tired)',
        achieved: false,
        category: 'vocabulary'
      }
    ],
    completed: false,
    locked: false,
    totalDuration: 126, // 7 episodes * 18 minutes average
    progressPercentage: 25,
    episodes: [
      {
        id: 'ep-1-1',
        number: 1,
        title: 'Welcome to Magic Island',
        description: 'Meet Bern and take your first steps on the magical island. Learn how to say hello and introduce yourself!',
        setting: 'Beach landing area with sparkling sand and gentle waves',
        narrativeHook: 'A magical compass appears, pointing to different parts of the island',
        duration: 15,
        type: 'standard',
        completed: true,
        locked: false,
        difficulty: 'veryEasy',
        vocabularyFocus: ['Hola', 'Me llamo', 'Adiós', 'Gracias'],
        learningOutcomes: ['greeting-1', 'intro-1'],
        completionRate: 100,
        lastPlayed: '2024-01-15',
        steps: [
          {
            id: 'step-1-1-1',
            title: 'Magic Island Landing',
            description: 'Arrive on the magical island and meet Bern',
            type: 'introduction',
            completed: true,
            difficulty: 'veryEasy',
            vocabularyWords: ['Hola'],
            estimatedDuration: 3,
            interactionCount: 2
          },
          {
            id: 'step-1-1-2',
            title: 'First Greetings',
            description: 'Learn to say hello in Spanish',
            type: 'vocabulary',
            completed: true,
            difficulty: 'veryEasy',
            vocabularyWords: ['Hola', 'Buenos días'],
            estimatedDuration: 5,
            interactionCount: 4
          },
          {
            id: 'step-1-1-3',
            title: 'My Name Is...',
            description: 'Practice introducing yourself',
            type: 'interaction',
            completed: true,
            difficulty: 'veryEasy',
            vocabularyWords: ['Me llamo'],
            estimatedDuration: 5,
            interactionCount: 3
          },
          {
            id: 'step-1-1-4',
            title: 'Magical Thank You',
            description: 'Learn to say thank you and goodbye',
            type: 'review',
            completed: true,
            difficulty: 'veryEasy',
            vocabularyWords: ['Gracias', 'Adiós'],
            estimatedDuration: 2,
            interactionCount: 2
          }
        ]
      },
      {
        id: 'ep-1-2',
        number: 2,
        title: 'Rainbow Forest Discovery',
        description: 'Venture into the colorful forest and discover magical colors while learning their Spanish names.',
        setting: 'Enchanted forest with trees that change colors',
        narrativeHook: 'A rainbow bridge appears, but we need to name each color to cross',
        duration: 18,
        type: 'standard',
        completed: false,
        locked: false,
        difficulty: 'easy',
        vocabularyFocus: ['Rojo', 'Azul', 'Verde', 'Amarillo', 'Rosa', 'Morado', 'Naranja', 'Blanco'],
        learningOutcomes: ['colors-1'],
        completionRate: 0,
        steps: [
          {
            id: 'step-1-2-1',
            title: 'Forest Entrance',
            description: 'Enter the magical rainbow forest',
            type: 'introduction',
            completed: false,
            difficulty: 'easy',
            vocabularyWords: ['Bosque', 'Colores'],
            estimatedDuration: 3,
            interactionCount: 2
          },
          {
            id: 'step-1-2-2',
            title: 'Primary Colors',
            description: 'Learn the three primary colors',
            type: 'vocabulary',
            completed: false,
            difficulty: 'easy',
            vocabularyWords: ['Rojo', 'Azul', 'Amarillo'],
            estimatedDuration: 6,
            interactionCount: 5
          },
          {
            id: 'step-1-2-3',
            title: 'More Magical Colors',
            description: 'Discover more colors in the forest',
            type: 'vocabulary',
            completed: false,
            difficulty: 'easy',
            vocabularyWords: ['Verde', 'Rosa', 'Morado', 'Naranja'],
            estimatedDuration: 6,
            interactionCount: 5
          },
          {
            id: 'step-1-2-4',
            title: 'Rainbow Bridge Challenge',
            description: 'Name all colors to cross the rainbow bridge',
            type: 'assessment',
            completed: false,
            difficulty: 'easy',
            vocabularyWords: ['Rojo', 'Azul', 'Verde', 'Amarillo', 'Rosa', 'Morado', 'Naranja', 'Blanco'],
            estimatedDuration: 3,
            interactionCount: 8
          }
        ]
      },
      {
        id: 'ep-1-3',
        number: 3,
        title: 'Counting Mountain Treasures',
        description: 'Climb the magical mountain and discover treasure chests while learning to count in Spanish.',
        setting: 'Mystical mountain with glowing caves and treasure chests',
        narrativeHook: 'Each treasure chest is locked with a number - count to unlock them!',
        duration: 18,
        type: 'standard',
        completed: false,
        locked: true,
        difficulty: 'easy',
        vocabularyFocus: ['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve', 'Diez'],
        learningOutcomes: ['numbers-1'],
        completionRate: 0,
        steps: []
      },
      {
        id: 'ep-1-4',
        number: 4,
        title: 'Village of Friendly Objects',
        description: 'Visit the island village and meet friendly objects that want to teach you their names.',
        setting: 'Charming village with talking houses, trees, and everyday objects',
        narrativeHook: 'The village objects are shy - say their names to become friends!',
        duration: 20,
        type: 'standard',
        completed: false,
        locked: true,
        difficulty: 'medium',
        vocabularyFocus: ['Casa', 'Árbol', 'Mesa', 'Silla', 'Libro', 'Pelota', 'Gato', 'Perro'],
        learningOutcomes: ['objects-1'],
        completionRate: 0,
        steps: []
      },
      {
        id: 'ep-1-5',
        number: 5,
        title: 'Feelings Festival',
        description: 'Join the island creatures in a festival of emotions and learn to express how you feel.',
        setting: 'Festival grounds with various emotion-themed areas',
        narrativeHook: 'The festival can only begin when everyone shares how they feel!',
        duration: 18,
        type: 'standard',
        completed: false,
        locked: true,
        difficulty: 'medium',
        vocabularyFocus: ['Feliz', 'Triste', 'Cansado', 'Emocionado', 'Asustado'],
        learningOutcomes: ['feelings-1'],
        completionRate: 0,
        steps: []
      },
      {
        id: 'ep-1-6',
        number: 6,
        title: 'Magic Show Spectacular',
        description: 'Put on a magic show using all the Spanish words you\'ve learned on the island.',
        setting: 'Grand theater stage in the center of the island',
        narrativeHook: 'You\'re the star of the magic show - use your Spanish words to create magic!',
        duration: 18,
        type: 'standard',
        completed: false,
        locked: true,
        difficulty: 'hard',
        vocabularyFocus: ['Review of all previous vocabulary'],
        learningOutcomes: ['All Season 1 outcomes'],
        completionRate: 0,
        steps: []
      },
      {
        id: 'ep-1-7',
        number: 7,
        title: 'Island Adventure Celebration',
        description: 'Celebrate your amazing progress with a special island-wide party featuring games and songs.',
        setting: 'Entire island celebrating with decorations and festivities',
        narrativeHook: 'The whole island wants to celebrate your Spanish learning journey!',
        duration: 22,
        type: 'weekend_special',
        completed: false,
        locked: true,
        difficulty: 'medium',
        vocabularyFocus: ['Review + celebration vocabulary'],
        learningOutcomes: ['Completion celebration'],
        completionRate: 0,
        steps: []
      }
    ]
  },
  
  {
    id: 'season-2',
    number: 2,
    title: 'City of Friends',
    theme: 'Practical Application',
    setting: 'A bustling city with various locations (park, market, school, home)',
    characterRole: 'Bern as a city guide helping navigate urban adventures',
    narrativeHook: 'Helping friends around the city with daily activities',
    description: 'Explore the busy city with Bern and learn practical Spanish for everyday situations!',
    learningFocus: ['Daily routines', 'Transportation', 'Food', 'Clothing', 'Directions'],
    learningOutcomes: [
      {
        id: 'sentences-1',
        description: 'Construct simple sentences with subject-verb-object',
        achieved: false,
        category: 'grammar'
      },
      {
        id: 'directions-1',
        description: 'Follow simple directions (left, right, forward)',
        achieved: false,
        category: 'vocabulary'
      },
      {
        id: 'questions-1',
        description: 'Ask basic questions (what, where, how many)',
        achieved: false,
        category: 'conversation'
      },
      {
        id: 'preferences-1',
        description: 'Express preferences (like/dislike)',
        achieved: false,
        category: 'conversation'
      },
      {
        id: 'adjectives-1',
        description: 'Describe objects with simple adjectives',
        achieved: false,
        category: 'grammar'
      },
      {
        id: 'numbers-2',
        description: 'Count from 11-20',
        achieved: false,
        category: 'vocabulary'
      }
    ],
    completed: false,
    locked: true,
    totalDuration: 140,
    progressPercentage: 0,
    episodes: []
  },
  
  {
    id: 'season-3',
    number: 3,
    title: 'Fantastic Journey',
    theme: 'Creative Expression',
    setting: 'Imaginative travel through different environments (space, underwater, jungle)',
    characterRole: 'Bern as a brave explorer with special equipment for each journey',
    narrativeHook: 'Collecting stories and artifacts from fantastical places',
    description: 'Join Bern on incredible adventures through space, underwater worlds, and magical jungles!',
    learningFocus: ['Descriptive language', 'Emotions', 'Comparisons', 'Storytelling elements'],
    learningOutcomes: [
      {
        id: 'descriptive-1',
        description: 'Use descriptive language with multiple adjectives',
        achieved: false,
        category: 'grammar'
      },
      {
        id: 'opinions-1',
        description: 'Express opinions with simple reasons',
        achieved: false,
        category: 'conversation'
      },
      {
        id: 'complex-sentences-1',
        description: 'Construct more complex sentences with conjunctions',
        achieved: false,
        category: 'grammar'
      },
      {
        id: 'past-tense-1',
        description: 'Understand and use past tense for simple actions',
        achieved: false,
        category: 'grammar'
      },
      {
        id: 'complex-questions-1',
        description: 'Ask more complex questions (why, when, how)',
        achieved: false,
        category: 'conversation'
      },
      {
        id: 'comparisons-1',
        description: 'Compare objects using comparative forms',
        achieved: false,
        category: 'grammar'
      }
    ],
    completed: false,
    locked: true,
    totalDuration: 154,
    progressPercentage: 0,
    episodes: []
  },
  
  {
    id: 'season-4',
    number: 4,
    title: 'World Celebrations',
    theme: 'Cultural Immersion',
    setting: 'Different countries and cultural events',
    characterRole: 'Bern as a cultural ambassador discovering traditions',
    narrativeHook: 'Preparing for and participating in celebrations around the world',
    description: 'Travel the world with Bern and discover amazing celebrations while mastering advanced Spanish!',
    learningFocus: ['Cultural expressions', 'Traditions', 'Specialized vocabulary', 'Complex phrases'],
    learningOutcomes: [
      {
        id: 'conversations-1',
        description: 'Engage in simple conversations with multiple exchanges',
        achieved: false,
        category: 'conversation'
      },
      {
        id: 'cultural-1',
        description: 'Understand cultural expressions and idioms',
        achieved: false,
        category: 'cultural'
      },
      {
        id: 'future-tense-1',
        description: 'Use future tense for simple planning',
        achieved: false,
        category: 'grammar'
      },
      {
        id: 'complex-emotions-1',
        description: 'Express complex emotions and thoughts',
        achieved: false,
        category: 'conversation'
      },
      {
        id: 'conditional-1',
        description: 'Understand and use conditional phrases',
        achieved: false,
        category: 'grammar'
      },
      {
        id: 'cultural-awareness-1',
        description: 'Demonstrate cultural awareness through language',
        achieved: false,
        category: 'cultural'
      }
    ],
    completed: false,
    locked: true,
    totalDuration: 168,
    progressPercentage: 0,
    episodes: []
  }
];

export const mockProficiencyMetrics: ProficiencyMetrics = {
  vocabularyMastery: {
    learning: 8,
    reviewing: 12,
    mastered: 15,
    total: 35
  },
  pronunciationAccuracy: 78,
  responseAppropriatenesss: 85,
  engagementLevel: 92,
  overallProficiency: 'easy',
  lastAssessment: '2024-01-15'
};

export const mockProgressStats: ProgressStats = {
  totalSeasons: 4,
  completedSeasons: 0,
  totalEpisodes: 28,
  completedEpisodes: 1,
  totalSteps: 112,
  completedSteps: 4,
  totalTimeSpent: 85,
  lastSessionDate: '2024-01-15',
  currentStreak: 3,
  proficiency: mockProficiencyMetrics,
  weeklyGoalMinutes: 120,
  weeklyCompletedMinutes: 45
};

export const mockChildProfile: ChildProfile = {
  id: '1',
  name: 'Emma',
  age: 4,
  languages: ['English', 'Spanish (Learning)'],
  preferredDifficulty: 'easy',
  adaptiveSettings: {
    responseTimeExtension: 2,
    repetitionCount: 2,
    vocabularyPerEpisode: 8,
    visualAidsEnabled: true
  },
  goals: {
    dailyMinutes: 15,
    weeklyEpisodes: 3,
    focusAreas: ['vocabulary', 'pronunciation']
  },
  wordsLearned: 42,
  topicsMastered: 3,
  learningStreak: 5,
  totalLearningTime: 90
};

export const mockTeddyBear: TeddyBear = {
  id: 'teddy-01',
  name: 'Bern',
  appearance: {
    color: 'warm brown',
    accessories: ['magical compass', 'explorer hat'],
    outfit: 'adventure vest'
  },
  connected: true,
  batteryLevel: 78,
  lastSyncDate: '2024-01-15T14:30:00',
  mood: 'excited'
};

export const mockMetricsData = {
  weeklyActivity: [
    { day: 'Mon', minutes: 18, episodes: 1 },
    { day: 'Tue', minutes: 0, episodes: 0 },
    { day: 'Wed', minutes: 15, episodes: 1 },
    { day: 'Thu', minutes: 12, episodes: 0 },
    { day: 'Fri', minutes: 0, episodes: 0 },
    { day: 'Sat', minutes: 0, episodes: 0 },
    { day: 'Sun', minutes: 0, episodes: 0 },
  ],
  vocabularyGrowth: [
    { week: 1, words: 8 },
    { week: 2, words: 15 },
    { week: 3, words: 23 },
    { week: 4, words: 35 },
  ],
  proficiencyScores: {
    vocabulary: 85,
    pronunciation: 78,
    conversation: 65,
    cultural: 45,
  },
  enjoymentRatings: [5, 4, 5, 5, 4], // Last 5 sessions
};