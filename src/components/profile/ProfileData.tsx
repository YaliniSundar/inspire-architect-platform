// Mock profiles data - would come from an API in a real app
export const MOCK_PROFILES = {
  'a1': {
    id: 'a1',
    name: 'Sarah Johnson',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    coverUrl: 'https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a',
    role: 'Architect & Interior Designer',
    location: 'Los Angeles, CA',
    yearsOfExperience: 8,
    followers: 1243,
    following: 156,
    about: 'Award-winning architect specializing in modern residential designs with a focus on sustainability and innovative use of space. My approach combines functionality with aesthetic beauty to create homes that reflect the unique personalities of my clients.',
    education: [
      { degree: 'Master of Architecture', institution: 'University of California, Los Angeles', year: '2015' },
      { degree: 'Bachelor of Arts in Design', institution: 'Rhode Island School of Design', year: '2012' }
    ],
    specialties: ['Modern', 'Minimalist', 'Sustainable', 'Residential'],
    awards: [
      { name: 'AIA Residential Design Award', year: '2021' },
      { name: 'Green Building Excellence Award', year: '2019' }
    ],
    contact: {
      email: 'sarah.johnson@designnext.com',
      website: 'www.sarahjohnsonarchitect.com'
    },
    reviews: [
      {
        id: 'r1',
        authorName: 'David Miller',
        authorAvatar: 'https://randomuser.me/api/portraits/men/75.jpg',
        rating: 5,
        date: 'March 2023',
        comment: 'Sarah designed our dream home! Her attention to detail and ability to translate our ideas into a beautiful, functional design was impressive. She was responsive and worked within our budget constraints.',
        projectTitle: 'Modern Family Home'
      },
      {
        id: 'r2',
        authorName: 'Maria Garcia',
        authorAvatar: 'https://randomuser.me/api/portraits/women/63.jpg',
        rating: 4,
        date: 'January 2023',
        comment: 'We hired Sarah for our kitchen renovation and couldn\'t be happier with the results. She has a great eye for balancing aesthetics with practicality.',
        projectTitle: 'Kitchen Renovation'
      }
    ],
    availableForHire: true
  },
  'a2': {
    id: 'a2',
    name: 'Michael Chen',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    coverUrl: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e',
    role: 'Architectural Designer',
    location: 'New York, NY',
    yearsOfExperience: 12,
    followers: 2150,
    following: 284,
    about: 'Urban design specialist with a passion for adaptive reuse and industrial spaces. I transform forgotten buildings into vibrant, functional environments that honor their history while embracing modern needs.',
    education: [
      { degree: 'Master of Architecture', institution: 'Columbia University', year: '2011' },
      { degree: 'Bachelor of Engineering', institution: 'Cornell University', year: '2008' }
    ],
    specialties: ['Industrial', 'Urban', 'Renovation', 'Commercial'],
    awards: [
      { name: 'Urban Renewal Excellence Award', year: '2022' },
      { name: 'Historic Preservation Honor', year: '2020' }
    ],
    contact: {
      email: 'michael.chen@designnext.com',
      website: 'www.michaelchendesign.com'
    },
    reviews: [
      {
        id: 'r3',
        authorName: 'Jennifer Taylor',
        authorAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        rating: 5,
        date: 'April 2023',
        comment: 'Michael transformed our outdated office space into a modern, collaborative environment. His knowledge of urban design principles and attention to our company culture made the project a huge success.',
        projectTitle: 'Office Renovation'
      }
    ],
    availableForHire: true
  },
};

// Mock designs for the profile
export const MOCK_PROFILE_DESIGNS = {
  'a1': [
    {
      id: '1',
      title: 'Modern Minimalist Villa',
      imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742',
      architect: {
        id: 'a1',
        name: 'Sarah Johnson',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      tags: ['Modern', 'Minimalist', 'Villa'],
      likes: 245,
      saves: 89,
      comments: 32,
    },
    {
      id: '4',
      title: 'Coastal Retreat',
      imageUrl: 'https://images.unsplash.com/photo-1439337153520-7082a56a81f4',
      architect: {
        id: 'a1',
        name: 'Sarah Johnson',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      tags: ['Coastal', 'Beach House', 'Vacation'],
      likes: 276,
      saves: 98,
      comments: 36,
    },
    {
      id: '8',
      title: 'Glass House by the Lake',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
      architect: {
        id: 'a1',
        name: 'Sarah Johnson',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      tags: ['Glass', 'Lake', 'Modern'],
      likes: 421,
      saves: 167,
      comments: 59,
    },
  ],
  'a2': [
    {
      id: '2',
      title: 'Urban Loft Renovation',
      imageUrl: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e',
      architect: {
        id: 'a2',
        name: 'Michael Chen',
        avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      tags: ['Industrial', 'Loft', 'Renovation'],
      likes: 189,
      saves: 67,
      comments: 21,
    },
    {
      id: '5',
      title: 'Contemporary City Apartment',
      imageUrl: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
      architect: {
        id: 'a2',
        name: 'Michael Chen',
        avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      tags: ['Contemporary', 'Apartment', 'City'],
      likes: 198,
      saves: 53,
      comments: 18,
    },
  ],
};

// All designs for browsing/collections
export const ALL_DESIGNS = [
  {
    id: '1',
    title: 'Modern Minimalist Villa',
    imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742',
    architect: {
      id: 'a1',
      name: 'Sarah Johnson',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    tags: ['Modern', 'Minimalist', 'Villa'],
    likes: 245,
    saves: 89,
    comments: 32,
  },
  {
    id: '2',
    title: 'Urban Loft Renovation',
    imageUrl: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e',
    architect: {
      id: 'a2',
      name: 'Michael Chen',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    tags: ['Industrial', 'Loft', 'Renovation'],
    likes: 189,
    saves: 67,
    comments: 21,
  },
  {
    id: '3',
    title: 'Scandinavian Inspired Home',
    imageUrl: 'https://images.unsplash.com/photo-1463797221720-6b07e6426c24',
    architect: {
      id: 'a3',
      name: 'Emma Nielsen',
      avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    tags: ['Scandinavian', 'Minimal', 'Cozy'],
    likes: 312,
    saves: 145,
    comments: 47,
  },
  {
    id: '4',
    title: 'Coastal Retreat',
    imageUrl: 'https://images.unsplash.com/photo-1439337153520-7082a56a81f4',
    architect: {
      id: 'a1',
      name: 'Sarah Johnson',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    tags: ['Coastal', 'Beach House', 'Vacation'],
    likes: 276,
    saves: 98,
    comments: 36,
  },
  {
    id: '5',
    title: 'Contemporary City Apartment',
    imageUrl: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
    architect: {
      id: 'a2',
      name: 'Michael Chen',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    tags: ['Contemporary', 'Apartment', 'City'],
    likes: 198,
    saves: 53,
    comments: 18,
  },
  {
    id: '6',
    title: 'Industrial Warehouse Conversion',
    imageUrl: 'https://images.unsplash.com/photo-1459535653751-d571815e906b',
    architect: {
      id: 'a4',
      name: 'James Wilson',
      avatarUrl: 'https://randomuser.me/api/portraits/men/79.jpg',
    },
    tags: ['Industrial', 'Warehouse', 'Conversion'],
    likes: 289,
    saves: 112,
    comments: 41,
  },
  {
    id: '7',
    title: 'Zen Garden House',
    imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858',
    architect: {
      id: 'a5',
      name: 'Yuki Tanaka',
      avatarUrl: 'https://randomuser.me/api/portraits/women/58.jpg',
    },
    tags: ['Japanese', 'Zen', 'Garden'],
    likes: 354,
    saves: 187,
    comments: 63,
  },
  {
    id: '8',
    title: 'Glass House by the Lake',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
    architect: {
      id: 'a1',
      name: 'Sarah Johnson',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    tags: ['Glass', 'Lake', 'Modern'],
    likes: 421,
    saves: 167,
    comments: 59,
  },
];
