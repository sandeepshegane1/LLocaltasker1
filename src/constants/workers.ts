import { 
  Shovel, Trash2, Home, Utensils, 
  BookOpen, Shirt, Baby, Dog, Camera, Music, Heart,
  LucideIcon 
} from 'lucide-react';

export interface WorkerCategory {
  category: string;
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
}

export const WORKER_CATEGORIES: WorkerCategory[] = [
  {
    category: 'GARDENING',
    title: 'Gardening & Farming',
    description: 'Expert gardeners and agricultural workers',
    icon: Shovel,
    image: 'https://images.unsplash.com/photo-1599629954294-16b394a8ba83?auto=format&fit=crop&w=500'
  },
  {
    category: 'HOME_CLEANING',
    title: 'Home Cleaning',
    description: 'Professional house cleaning services',
    icon: Trash2,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500'
  },
  {
    category: 'LANDSCAPING',
    title: 'Landscaping',
    description: 'Professional landscape maintenance',
    icon: Trash2,
    image: 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=500'
  },
  {
    category: 'HOME_MAINTENANCE',
    title: 'Home Maintenance',
    description: 'General home maintenance and repairs',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500'
  },
  {
    category: 'COOKING',
    title: 'Cooking & Catering',
    description: 'Professional chefs and caterers',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=500'
  },
  {
    category: 'TUTORING',
    title: 'Tutoring',
    description: 'Educational support and tutoring',
    icon: BookOpen,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=500'
  },
  {
    category: 'LAUNDRY',
    title: 'Laundry Services',
    description: 'Professional laundry and ironing',
    icon: Shirt,
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=500'
  },
  {
    category: 'BABYSITTING',
    title: 'Babysitting',
    description: 'Childcare and babysitting services',
    icon: Baby,
    image: 'https://images.unsplash.com/photo-1587616211892-f743fcca64f9?auto=format&fit=crop&w=500'
  },
  {
    category: 'PET_CARE',
    title: 'Pet Care',
    description: 'Pet sitting and dog walking',
    icon: Dog,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=500'
  },
  {
    category: 'PHOTOGRAPHY',
    title: 'Photography',
    description: 'Professional photography services',
    icon: Camera,
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=500'
  },
  {
    category: 'MUSIC_LESSONS',
    title: 'Music Lessons',
    description: 'Music education and training',
    icon: Music,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=500'
  },
  {
    category: 'ELDERLY_CARE',
    title: 'Elderly Care',
    description: 'Senior care and assistance',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=500'
  }
];