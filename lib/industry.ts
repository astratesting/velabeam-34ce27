export const INDUSTRIES = [
  { key: 'restaurant', label: 'Restaurant', category: 'food' },
  { key: 'dental', label: 'Dental', category: 'health' },
  { key: 'legal', label: 'Legal', category: 'professional' },
  { key: 'salon', label: 'Salon', category: 'beauty' },
  { key: 'auto', label: 'Auto', category: 'automotive' },
  { key: 'real_estate', label: 'Real Estate', category: 'property' },
  { key: 'fitness', label: 'Fitness', category: 'health' },
  { key: 'general', label: 'General', category: 'other' },
] as const;

export type IndustryKey = typeof INDUSTRIES[number]['key'];

export const GOOGLE_PLACE_CATEGORIES: Record<IndustryKey, string[]> = {
  restaurant: ['restaurant', 'food', 'meal_takeaway', 'cafe'],
  dental: ['dentist', 'dental_clinic'],
  legal: ['lawyer', 'legal_services'],
  salon: ['beauty_salon', 'hair_care', 'spa'],
  auto: ['car_dealer', 'car_repair', 'auto_parts_store'],
  real_estate: ['real_estate_agency', 'real_estate_developer'],
  fitness: ['gym', 'fitness_center', 'yoga_studio'],
  general: ['store', 'service'],
};

export function getIndustryByKey(key: string) {
  return INDUSTRIES.find(i => i.key === key) ?? INDUSTRIES[INDUSTRIES.length - 1];
}

export function getIndustryLabel(key: string): string {
  return getIndustryByKey(key).label;
}

export function getIndustryTemplateKey(key: string): string {
  const valid = INDUSTRIES.find(i => i.key === key);
  return valid ? valid.key : 'general';
}

export function getTemplateComponent(key: string): string {
  const map: Record<string, string> = {
    restaurant: 'Restaurant',
    dental: 'Dental',
    legal: 'Legal',
    salon: 'Salon',
    auto: 'Auto',
    real_estate: 'RealEstate',
    fitness: 'Fitness',
    general: 'General',
  };
  return map[key] ?? 'General';
}

export function estimateMRR(industry: string, _reviewCount: number, _rating: number): number {
  // Base MRR estimates by industry (in cents)
  const baseEstimates: Record<string, number> = {
    restaurant: 15000,
    dental: 25000,
    legal: 30000,
    salon: 12000,
    auto: 20000,
    real_estate: 35000,
    fitness: 15000,
    general: 10000,
  };
  return baseEstimates[industry] ?? 10000;
}
