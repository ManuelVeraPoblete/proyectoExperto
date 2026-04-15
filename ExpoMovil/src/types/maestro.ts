export interface Maestro {
  id: string;
  name: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  location: string;
  experience: string;
  priceRange: string;
  avatar?: string;
}
