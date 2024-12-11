import { Trash2, Home, Utensils, BookOpen, Shirt, Baby, Dog, Camera, Music, Heart, Briefcase, Car, Scissors, Wrench, Paintbrush, Truck, Wifi, Laptop, Dumbbell, SpadeIcon as Spa, Mic, Palette, Hammer, Stethoscope, Glasses, Leaf, TypeIcon as type, LucideIcon } from 'lucide-react';

export interface WorkerCategory {
  category: string;
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
}

export const WORKER_CATEGORIES: WorkerCategory[] = [
  {
    category: 'HOUSEKEEPER',
    title: 'Housekeeper',
    description: 'Cleaning and maintaining homes',
    icon: Trash2,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500'
  },
  {
    category: 'HANDYMAN',
    title: 'Handyman',
    description: 'General home repairs and maintenance',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500'
  },
  {
    category: 'CHEF',
    title: 'Chef',
    description: 'Professional cooking and meal preparation',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=500'
  },
  {
    category: 'TUTOR',
    title: 'Tutor',
    description: 'Educational support and instruction',
    icon: BookOpen,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=500'
  },
  {
    category: 'LAUNDRY_WORKER',
    title: 'Laundry Worker',
    description: 'Washing, drying, and ironing clothes',
    icon: Shirt,
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=500'
  },
  {
    category: 'BABYSITTER',
    title: 'Babysitter',
    description: 'Childcare and supervision',
    icon: Baby,
    image: 'https://images.unsplash.com/photo-1587616211892-f743fcca64f9?auto=format&fit=crop&w=500'
  },
  {
    category: 'PET_SITTER',
    title: 'Pet Sitter',
    description: 'Care for pets in owners\' absence',
    icon: Dog,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=500'
  },
  {
    category: 'PHOTOGRAPHER',
    title: 'Photographer',
    description: 'Capturing and editing photos',
    icon: Camera,
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=500'
  },
  {
    category: 'MUSIC_TEACHER',
    title: 'Music Teacher',
    description: 'Instructing in musical instruments or voice',
    icon: Music,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=500'
  },
  {
    category: 'CAREGIVER',
    title: 'Caregiver',
    description: 'Assisting elderly or disabled individuals',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=500'
  },
  {
    category: 'PERSONAL_ASSISTANT',
    title: 'Personal Assistant',
    description: 'Managing schedules and tasks',
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500'
  },
  {
    category: 'DRIVER',
    title: 'Driver',
    description: 'Providing transportation services',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=500'
  },
  {
    category: 'BEAUTICIAN',
    title: 'Beautician',
    description: 'Providing beauty treatments',
    icon: Scissors,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=500'
  },
  {
    category: 'PLUMBER',
    title: 'Plumber',
    description: 'Installing and repairing plumbing systems',
    icon: Wrench,
    image: 'https://images.unsplash.com/photo-1603796846097-bee99e4a601f?auto=format&fit=crop&w=500'
  },
  {
    category: 'PAINTER',
    title: 'Painter',
    description: 'Painting interiors and exteriors',
    icon: Paintbrush,
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=500'
  },
  {
    category: 'MOVER',
    title: 'Mover',
    description: 'Packing and transporting belongings',
    icon: Truck,
    image: 'https://images.unsplash.com/photo-1603796846097-bee99e4a601f?auto=format&fit=crop&w=500'
  },
  {
    category: 'IT_TECHNICIAN',
    title: 'IT Technician',
    description: 'Resolving computer and network issues',
    icon: Wifi,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500'
  },
  {
    category: 'GRAPHIC_DESIGNER',
    title: 'Graphic Designer',
    description: 'Creating visual content and designs',
    icon: Laptop,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=500'
  },
  {
    category: 'PERSONAL_TRAINER',
    title: 'Personal Trainer',
    description: 'Guiding fitness and exercise routines',
    icon: Dumbbell,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=500'
  },
  {
    category: 'MASSAGE_THERAPIST',
    title: 'Massage Therapist',
    description: 'Providing therapeutic massage',
    icon: Spa,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=500'
  },
  {
    category: 'EVENT_PLANNER',
    title: 'Event Planner',
    description: 'Organizing and coordinating events',
    icon: Mic,
    image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=500'
  },
  {
    category: 'ART_TEACHER',
    title: 'Art Teacher',
    description: 'Instructing in various art techniques',
    icon: Palette,
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=500'
  },
  {
    category: 'CARPENTER',
    title: 'Carpenter',
    description: 'Constructing and repairing wooden structures',
    icon: Hammer,
    image: 'https://images.unsplash.com/photo-1601564921647-b446839a013f?auto=format&fit=crop&w=500'
  },
  {
    category: 'NURSE',
    title: 'Nurse',
    description: 'Providing medical care and support',
    icon: Stethoscope,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=500'
  },
  {
    category: 'TUTOR',
    title: 'Tutor',
    description: 'Providing academic instruction and support',
    icon: Glasses,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500'
  },
  {
    category: 'LANDSCAPER',
    title: 'Landscaper',
    description: 'Maintaining and designing outdoor spaces',
    icon: Leaf,
    image: 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=500'
  }
];

