import { 
  Wrench, Zap, Trash2, Paintbrush, 
  Home, Car, LucideIcon 
} from 'lucide-react';

export interface Service {
  category: string;
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
}

export const SERVICES: Service[] = [
  {
    category: 'PLUMBING',
    title: 'Plumbing Services',
    description: 'Professional plumbing solutions for your home',
    icon: Wrench,
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=500'
  },
  {
    category: 'ELECTRICAL',
    title: 'Electrical Services',
    description: 'Expert electrical repairs and installations',
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=500'
  },
  {
    category: 'CLEANING',
    title: 'Cleaning Services',
    description: 'Professional cleaning for your space',
    icon: Trash2,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500'
  },
  {
    category: 'LANDSCAPING',
    title: 'Landscaping',
    description: 'Transform your outdoor space',
    icon: Trash2,
    image: 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=500'
  },
  {
    category: 'PAINTING',
    title: 'Painting Services',
    description: 'Professional painting for interior and exterior',
    icon: Paintbrush,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=500'
  },
  {
    category: 'HOME_RENOVATION',
    title: 'Home Renovation',
    description: 'Complete home renovation services',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=500'
  },
  {
    category: 'CAR_MAINTENANCE',
    title: 'Car Maintenance',
    description: 'Professional auto repair and maintenance',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=500'
  },
  {
    category: 'HANDYMAN',
    title: 'Handyman Services',
    description: 'General repairs and maintenance',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=500'
  }
];