import { Wrench, Zap, Trash2, Paintbrush, Home, Car, Scissors, Utensils, Dog, Camera, Music, Heart, Briefcase, Truck, Wifi, Laptop, Dumbbell, SpadeIcon as Spa, Mic, Palette, Book, Shirt, Baby, TreesIcon as Tree, Key, Hammer, Stethoscope, Glasses, ShowerHead, Tv, Plane, Umbrella, type LucideIcon } from 'lucide-react';

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
    icon: Tree,
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
    icon: Hammer,
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=500'
  },
  {
    category: 'BEAUTY',
    title: 'Beauty Services',
    description: 'Professional hair, makeup, and nail care',
    icon: Scissors,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=500'
  },
  {
    category: 'CATERING',
    title: 'Catering Services',
    description: 'Professional food preparation for events',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=500'
  },
  {
    category: 'PET_CARE',
    title: 'Pet Care Services',
    description: 'Professional pet sitting and grooming',
    icon: Dog,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=500'
  },
  {
    category: 'PHOTOGRAPHY',
    title: 'Photography Services',
    description: 'Professional photo shoots and editing',
    icon: Camera,
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=500'
  },
  {
    category: 'MUSIC_PRODUCTION',
    title: 'Music Production',
    description: 'Professional recording and music production',
    icon: Music,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=500'
  },
  {
    category: 'ELDER_CARE',
    title: 'Elder Care Services',
    description: 'Professional care for seniors',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=500'
  },
  {
    category: 'PERSONAL_ASSISTANT',
    title: 'Personal Assistant Services',
    description: 'Professional assistance for daily tasks',
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500'
  },
  {
    category: 'MOVING',
    title: 'Moving Services',
    description: 'Professional packing and moving assistance',
    icon: Truck,
    image: 'https://images.unsplash.com/photo-1603796846097-bee99e4a601f?auto=format&fit=crop&w=500'
  },
  {
    category: 'IT_SUPPORT',
    title: 'IT Support Services',
    description: 'Professional tech support and troubleshooting',
    icon: Wifi,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500'
  },
  {
    category: 'GRAPHIC_DESIGN',
    title: 'Graphic Design Services',
    description: 'Professional design for digital and print media',
    icon: Laptop,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=500'
  },
  {
    category: 'FITNESS_TRAINING',
    title: 'Fitness Training Services',
    description: 'Professional personal training and fitness coaching',
    icon: Dumbbell,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=500'
  },
  {
    category: 'MASSAGE',
    title: 'Massage Services',
    description: 'Professional massage therapy',
    icon: Spa,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=500'
  },
  {
    category: 'EVENT_PLANNING',
    title: 'Event Planning Services',
    description: 'Professional event organization and management',
    icon: Mic,
    image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=500'
  },
  {
    category: 'ART_LESSONS',
    title: 'Art Lesson Services',
    description: 'Professional art instruction for various mediums',
    icon: Palette,
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=500'
  },
  {
    category: 'TUTORING',
    title: 'Tutoring Services',
    description: 'Professional academic instruction and support',
    icon: Book,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=500'
  },
  {
    category: 'LAUNDRY',
    title: 'Laundry Services',
    description: 'Professional washing, drying, and ironing',
    icon: Shirt,
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=500'
  },
  {
    category: 'CHILDCARE',
    title: 'Childcare Services',
    description: 'Professional babysitting and child care',
    icon: Baby,
    image: 'https://images.unsplash.com/photo-1587616211892-f743fcca64f9?auto=format&fit=crop&w=500'
  },
  {
    category: 'REAL_ESTATE',
    title: 'Real Estate Services',
    description: 'Professional property management and sales',
    icon: Key,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500'
  },
  {
    category: 'MEDICAL',
    title: 'Medical Services',
    description: 'Professional healthcare and medical assistance',
    icon: Stethoscope,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500'
  },
  {
    category: 'OPTOMETRY',
    title: 'Optometry Services',
    description: 'Professional eye care and vision services',
    icon: Glasses,
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=500'
  },
  {
    category: 'PEST_CONTROL',
    title: 'Pest Control Services',
    description: 'Professional pest elimination and prevention',
    icon: Trash2,
    image: 'https://images.unsplash.com/photo-1632935190508-bd46801c14af?auto=format&fit=crop&w=500'
  },
  {
    category: 'POOL_MAINTENANCE',
    title: 'Pool Maintenance Services',
    description: 'Professional pool cleaning and maintenance',
    icon: ShowerHead,
    image: 'https://images.unsplash.com/photo-1562844275-857f6e7c7d4b?auto=format&fit=crop&w=500'
  },
  {
    category: 'HOME_THEATER',
    title: 'Home Theater Services',
    description: 'Professional home theater installation and setup',
    icon: Tv,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=500'
  },
  {
    category: 'TRAVEL_PLANNING',
    title: 'Travel Planning Services',
    description: 'Professional travel arrangement and itinerary planning',
    icon: Plane,
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500'
  },
  {
    category: 'INSURANCE',
    title: 'Insurance Services',
    description: 'Professional insurance consulting and policies',
    icon: Umbrella,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500'
  }
];

