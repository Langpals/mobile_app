import { Season, ProgressStats, ChildProfile, TeddyBear } from '@/types';

export const mockSeasons: Season[] = [
  {
    id: '1',
    number: 1,
    title: 'Journey to Iceland',
    description: 'Begin the language adventure with basic concepts and simple words',
    learningObjectives: [
      'Recognize 20 common objects',
      'Understand basic greetings',
      'Respond to simple instructions',
      'Identify family members'
    ],
    completed: false,
    locked: false,
    episodes: [
      {
        id: '1-1',
        number: 1,
        title: 'First Words',
        description: 'Learn to recognize and say your first words',
        duration: 20,
        completed: true,
        locked: false,
        difficulty: 'easy',
        steps: [
          {
            id: '1-1-1',
            title: 'Say Hello',
            description: 'Learn basic greetings and how to say hello',
            completed: true,
            difficulty: 'easy'
          },
          {
            id: '1-1-2',
            title: 'Family Names',
            description: 'Learn to recognize family member names',
            completed: true,
            difficulty: 'easy'
          },
          {
            id: '1-1-3',
            title: 'My First Objects',
            description: 'Point to and name common objects around you',
            completed: true,
            difficulty: 'easy'
          }
        ]
      },
      {
        id: '1-2',
        number: 2,
        title: 'Building a Circle',
        description: 'Learn about shapes and colors',
        duration: 25,
        completed: false,
        locked: false,
        difficulty: 'easy',
        steps: [
          {
            id: '1-2-1',
            title: 'Circle, Square, Triangle',
            description: 'Identify basic shapes around you',
            completed: false,
            difficulty: 'easy'
          },
          {
            id: '1-2-2',
            title: 'Colors Everywhere',
            description: 'Learn to name and identify colors',
            completed: false,
            difficulty: 'easy'
          },
          {
            id: '1-2-3',
            title: 'Match and Sort',
            description: 'Practice matching shapes with colors',
            completed: false,
            difficulty: 'medium'
          }
        ]
      },
      {
        id: '1-3',
        number: 3,
        title: 'Animals and Sounds',
        description: 'Discover animal names and the sounds they make',
        duration: 30,
        completed: false,
        locked: false,
        difficulty: 'medium',
        steps: [
          {
            id: '1-3-1',
            title: 'Farm Animals',
            description: 'Learn about common farm animals and their sounds',
            completed: false,
            difficulty: 'easy'
          },
          {
            id: '1-3-2',
            title: 'Wild Animals',
            description: 'Discover jungle and safari animals',
            completed: false,
            difficulty: 'medium'
          },
          {
            id: '1-3-3',
            title: 'Animal Actions',
            description: 'Learn verbs associated with animal movements',
            completed: false,
            difficulty: 'medium'
          }
        ]
      },
      {
        id: '1-4',
        number: 4,
        title: 'Daily Routines',
        description: 'Learn words for everyday activities',
        duration: 25,
        completed: false,
        locked: true,
        difficulty: 'medium',
        steps: [
          {
            id: '1-4-1',
            title: 'Morning Routine',
            description: 'Words for waking up, eating breakfast, and getting dressed',
            completed: false,
            difficulty: 'medium'
          },
          {
            id: '1-4-2',
            title: 'Mealtime Words',
            description: 'Learn food names and eating-related words',
            completed: false,
            difficulty: 'medium'
          },
          {
            id: '1-4-3',
            title: 'Bedtime Routine',
            description: 'Words for evening activities and going to sleep',
            completed: false,
            difficulty: 'medium'
          }
        ]
      },
      {
        id: '1-5',
        number: 5,
        title: 'Feelings and Emotions',
        description: 'Express how you feel with words',
        duration: 30,
        completed: false,
        locked: true,
        difficulty: 'hard',
        steps: [
          {
            id: '1-5-1',
            title: 'Happy or Sad',
            description: 'Basic emotion words and facial expressions',
            completed: false,
            difficulty: 'medium'
          },
          {
            id: '1-5-2',
            title: 'More Feelings',
            description: 'Learn to express excited, tired, scared and surprised',
            completed: false,
            difficulty: 'hard'
          },
          {
            id: '1-5-3',
            title: 'How Do You Feel?',
            description: 'Practice identifying and naming emotions',
            completed: false,
            difficulty: 'hard'
          }
        ]
      },
      {
        id: '1-6',
        number: 6,
        title: 'Outside Adventures',
        description: 'Words for places, weather, and outdoor activities',
        duration: 35,
        completed: false,
        locked: true,
        difficulty: 'hard',
        steps: [
          {
            id: '1-6-1',
            title: 'Weather Words',
            description: 'Learn words for sunny, rainy, windy, and snowy days',
            completed: false,
            difficulty: 'medium'
          },
          {
            id: '1-6-2',
            title: 'Places to Go',
            description: 'Words for park, store, home, and other locations',
            completed: false,
            difficulty: 'hard'
          },
          {
            id: '1-6-3',
            title: 'Transportation',
            description: 'Learn words for car, bus, train, and airplane',
            completed: false,
            difficulty: 'hard'
          }
        ]
      },
      {
        id: '1-7',
        number: 7,
        title: 'Story Time',
        description: 'Put it all together with simple stories',
        duration: 40,
        completed: false,
        locked: true,
        difficulty: 'veryHard',
        steps: [
          {
            id: '1-7-1',
            title: 'Beginning, Middle, End',
            description: 'Understand story sequence with simple tales',
            completed: false,
            difficulty: 'hard'
          },
          {
            id: '1-7-2',
            title: 'Characters and Actions',
            description: 'Talk about who and what in stories',
            completed: false,
            difficulty: 'hard'
          },
          {
            id: '1-7-3',
            title: 'Tell Your Story',
            description: 'Practice telling a simple story with beginning and end',
            completed: false,
            difficulty: 'veryHard'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    number: 2,
    title: 'Nordic Adventures',
    description: 'Expand vocabulary and begin forming simple sentences',
    learningObjectives: [
      'Form basic 2-3 word sentences',
      'Ask and answer simple questions',
      'Expand vocabulary to 50+ words',
      'Follow multi-step instructions'
    ],
    completed: false,
    locked: true,
    episodes: []
  }
];

export const mockProgressStats: ProgressStats = {
  totalEpisodes: 14,
  completedEpisodes: 1,
  totalSteps: 42,
  completedSteps: 3,
  totalTimeSpent: 60,
  lastSessionDate: '2023-10-15'
};

export const mockChildProfile: ChildProfile = {
  id: '1',
  name: 'Emma',
  age: 2,
  languages: ['English', 'Spanish'],
};

export const mockTeddyBear: TeddyBear = {
  id: 'teddy-01',
  name: 'Bernie',
  connected: true,
  batteryLevel: 78,
  lastSyncDate: '2023-10-15T14:30:00'
};

export const mockMetricsData = {
  weeklyActivity: [
    { day: 'Mon', minutes: 15 },
    { day: 'Tue', minutes: 20 },
    { day: 'Wed', minutes: 10 },
    { day: 'Thu', minutes: 25 },
    { day: 'Fri', minutes: 15 },
    { day: 'Sat', minutes: 30 },
    { day: 'Sun', minutes: 5 },
  ],
  vocabularyGrowth: [
    { week: 1, words: 5 },
    { week: 2, words: 12 },
    { week: 3, words: 18 },
    { week: 4, words: 25 },
  ],
  proficiencyScores: {
    understanding: 75,
    speaking: 60,
    recognition: 85,
    engagement: 90,
  },
};