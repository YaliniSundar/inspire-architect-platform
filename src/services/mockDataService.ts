
// Mock User Data
export const currentUser = {
  id: 'user-123',
  name: 'Demo User',
  email: 'demo@example.com',
  userType: 'homeowner',
  profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
};

// Mock Architects
export const architects = [
  {
    id: 'architect-1',
    name: 'Jane Architect',
    profilePicture: 'https://images.unsplash.com/photo-1521252659862-eec69941b071?auto=format&fit=crop&q=80&w=200&h=200',
    role: 'architect',
    specialization: 'Modern Minimalist',
    followers: 235,
    projects: 42,
  },
  {
    id: 'architect-2',
    name: 'Michael Designer',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
    role: 'architect',
    specialization: 'Victorian Restoration',
    followers: 189,
    projects: 31,
  },
  {
    id: 'architect-3',
    name: 'Sara Builder',
    profilePicture: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&q=80&w=200&h=200',
    role: 'architect',
    specialization: 'Eco-friendly Design',
    followers: 312,
    projects: 56,
  },
];

// Mock Design Posts
export const designPosts = [
  {
    id: 'post-1',
    title: 'Modern Beachfront Villa',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
    description: 'A luxurious beachfront villa with panoramic ocean views.',
    architect: architects[0],
    likes: 423,
    comments: 56,
    tags: ['Modern', 'Beachfront', 'Luxury']
  },
  {
    id: 'post-2',
    title: 'Urban Minimalist Apartment',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600',
    description: 'Clean lines and minimalist design in the heart of the city.',
    architect: architects[1],
    likes: 287,
    comments: 34,
    tags: ['Minimalist', 'Urban', 'Apartment']
  },
  {
    id: 'post-3',
    title: 'Sustainable Forest Cabin',
    imageUrl: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&q=80&w=600',
    description: 'Eco-friendly cabin built with sustainable materials.',
    architect: architects[2],
    likes: 512,
    comments: 78,
    tags: ['Sustainable', 'Cabin', 'Eco-friendly']
  },
];

// Mock user's saved designs
export const savedDesigns = [designPosts[0], designPosts[2]];

// Get design by ID
export const getDesignById = (id: string) => {
  return designPosts.find(post => post.id === id) || null;
};

// Get architect by ID
export const getArchitectById = (id: string) => {
  return architects.find(architect => architect.id === id) || null;
};
