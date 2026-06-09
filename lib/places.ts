import { env } from './env';
import { GOOGLE_PLACE_CATEGORIES, type IndustryKey, estimateMRR } from './industry';

export interface PlaceResult {
  externalPlaceId: string;
  name: string;
  industry: IndustryKey;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  websiteUrl: string | null;
  rating: number | null;
  reviewCount: number;
}

export interface ScanResult {
  prospects: PlaceResult[];
  totalFound: number;
}

export async function scanProspects(params: {
  lat: number;
  lng: number;
  radiusMeters: number;
  industries: IndustryKey[];
}): Promise<ScanResult> {
  if (!env.GOOGLE_PLACES_API_KEY) {
    return { prospects: generateStubProspects(params), totalFound: 0 };
  }

  const allResults: PlaceResult[] = [];

  for (const industry of params.industries) {
    const categories = GOOGLE_PLACE_CATEGORIES[industry];
    for (const category of categories.slice(0, 2)) {
      try {
        const results = await searchNearby({
          lat: params.lat,
          lng: params.lng,
          radius: params.radiusMeters,
          type: category,
        });
        for (const r of results) {
          if (!allResults.find(a => a.externalPlaceId === r.externalPlaceId)) {
            allResults.push({ ...r, industry });
          }
        }
      } catch {
        // Continue with other categories
      }
    }
  }

  return { prospects: allResults, totalFound: allResults.length };
}

async function searchNearby(params: {
  lat: number;
  lng: number;
  radius: number;
  type: string;
}): Promise<PlaceResult[]> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  url.searchParams.set('location', `${params.lat},${params.lng}`);
  url.searchParams.set('radius', String(params.radius));
  url.searchParams.set('type', params.type);
  url.searchParams.set('key', env.GOOGLE_PLACES_API_KEY!);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Places API error');

  const data = await res.json();
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Places API: ${data.status}`);
  }

  return (data.results ?? []).map((r: any) => ({
    externalPlaceId: r.place_id,
    name: r.name,
    industry: 'general' as IndustryKey,
    address: r.vicinity ?? r.formatted_address ?? '',
    lat: r.geometry.location.lat,
    lng: r.geometry.location.lng,
    phone: r.formatted_phone_number ?? null,
    websiteUrl: r.website ?? null,
    rating: r.rating ?? null,
    reviewCount: r.user_ratings_total ?? 0,
  }));
}

export async function checkHasWebsite(url: string | null): Promise<boolean> {
  if (!url) return false;
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    if (!res.ok) return false;
    const text = await res.text().catch(() => '');
    // Simple heuristic: if the page has very little content or looks like a parking page
    if (text.length < 500) return false;
    if (/domain (is for sale|parking|expired)/i.test(text)) return false;
    return true;
  } catch {
    return false;
  }
}

function generateStubProspects(params: {
  lat: number;
  lng: number;
  industries: IndustryKey[];
}): PlaceResult[] {
  const stubs: PlaceResult[] = [];
  const names: Record<string, string[]> = {
    restaurant: ['Sunrise Bistro', 'Harbor Kitchen', 'The Golden Fork'],
    dental: ['Bright Smile Dental', 'Coastal Dental Care', 'Downtown Dental Studio'],
    legal: ['Harbor Law Group', 'Pacific Legal Partners', 'Shore Line Attorneys'],
    salon: ['Luxe Hair Studio', 'The Style Room', 'Coastal Cuts Salon'],
    auto: ['Bay Auto Works', 'Precision Auto Care', 'Harbor Motor Co'],
    real_estate: ['Beacon Realty', 'Shore Properties', 'Vela Real Estate Group'],
    fitness: ['Iron Harbor Gym', 'Wave Fitness', 'Bay Area CrossFit'],
    general: ['The Print Shop', 'CleanPro Services', 'Bright Tech Solutions'],
  };

  let idx = 0;
  for (const industry of params.industries) {
    const industryNames = names[industry] ?? names.general;
    for (const name of industryNames) {
      stubs.push({
        externalPlaceId: `stub_${industry}_${idx}`,
        name,
        industry,
        address: `${100 + idx * 10} Main Street`,
        lat: params.lat + (Math.random() - 0.5) * 0.05,
        lng: params.lng + (Math.random() - 0.5) * 0.05,
        phone: null,
        websiteUrl: null,
        rating: 3.5 + Math.random() * 1.5,
        reviewCount: Math.floor(Math.random() * 200),
      });
      idx++;
    }
  }

  return stubs;
}
