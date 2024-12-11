import { Wheat, Tractor, Sprout, Trees, Apple, Milk, Bird, Fish, Warehouse, Microscope, Wrench, Truck, Shovel, Scissors, Bug, Droplets, Sun, Factory, Combine, TypeIcon as type, LucideIcon } from 'lucide-react';

export interface FarmersServices {
  category: string;
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
}

export const FARMERS_SERVICES: FarmersServices[] =  [
  {
    category: 'CROP_FARMER',
    title: 'Crop Farmer',
    description: 'Managing and growing various crops',
    icon: Wheat,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=500'
  },
  {
    category: 'EQUIPMENT_OPERATOR',
    title: 'Equipment Operator',
    description: 'Operating farm machinery and equipment',
    icon: Tractor,
    image: 'https://images.unsplash.com/photo-1592840062661-a5a7f78e2056?auto=format&fit=crop&w=500'
  },
  {
    category: 'GREENHOUSE_WORKER',
    title: 'Greenhouse Worker',
    description: 'Managing indoor plant cultivation',
    icon: Sprout,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=500'
  },
  {
    category: 'FORESTER',
    title: 'Forester',
    description: 'Managing forest resources and timber',
    icon: Trees,
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=500'
  },
  {
    category: 'ORCHARD_WORKER',
    title: 'Orchard Worker',
    description: 'Maintaining fruit trees and harvesting',
    icon: Apple,
    image: 'https://images.unsplash.com/photo-1474564862106-1f23d10b9d72?auto=format&fit=crop&w=500'
  },
  {
    category: 'DAIRY_FARMER',
    title: 'Dairy Farmer',
    description: 'Managing dairy operations and cattle',
    icon: Milk,
    image: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=500'
  },
  {
    category: 'POULTRY_WORKER',
    title: 'Poultry Worker',
    description: 'Managing poultry operations',
    icon: Bird,
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=500'
  },
  {
    category: 'AQUACULTURE_WORKER',
    title: 'Aquaculture Worker',
    description: 'Managing fish farming operations',
    icon: Fish,
    image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=500'
  },
  {
    category: 'STORAGE_MANAGER',
    title: 'Storage Manager',
    description: 'Managing crop and equipment storage',
    icon: Warehouse,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=500'
  },
  {
    category: 'AGRICULTURAL_SCIENTIST',
    title: 'Agricultural Scientist',
    description: 'Conducting agricultural research',
    icon: Microscope,
    image: 'https://images.unsplash.com/photo-1576319155264-99536e0be1ee?auto=format&fit=crop&w=500'
  },
  {
    category: 'FARM_MECHANIC',
    title: 'Farm Mechanic',
    description: 'Maintaining and repairing farm equipment',
    icon: Wrench,
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=500'
  },
  {
    category: 'TRANSPORTATION_WORKER',
    title: 'Transportation Worker',
    description: 'Transporting agricultural products',
    icon: Truck,
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=500'
  },
  {
    category: 'FIELD_WORKER',
    title: 'Field Worker',
    description: 'General field labor and harvesting',
    icon: Shovel,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500'
  },
  {
    category: 'PRUNING_SPECIALIST',
    title: 'Pruning Specialist',
    description: 'Maintaining plant health through pruning',
    icon: Scissors,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=500'
  },
  {
    category: 'PEST_CONTROLLER',
    title: 'Pest Controller',
    description: 'Managing agricultural pests',
    icon: Bug,
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=500'
  },
  {
    category: 'IRRIGATION_SPECIALIST',
    title: 'Irrigation Specialist',
    description: 'Managing water systems and irrigation',
    icon: Droplets,
    image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=500'
  },
  {
    category: 'GREENHOUSE_TECHNICIAN',
    title: 'Greenhouse Technician',
    description: 'Maintaining greenhouse systems',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=500'
  },
  {
    category: 'PROCESSING_WORKER',
    title: 'Processing Worker',
    description: 'Processing agricultural products',
    icon: Factory,
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=500'
  },
  {
    category: 'HARVESTING_OPERATOR',
    title: 'Harvesting Operator',
    description: 'Operating harvesting machinery',
    icon: Combine,
    image: 'https://images.unsplash.com/photo-1472157592780-9e5265f17f8f?auto=format&fit=crop&w=500'
  }
];

