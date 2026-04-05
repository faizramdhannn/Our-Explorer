export type Theme = 'female' | 'male';

export interface Location {
  id: string;
  location_name: string;
  location_maps: string;
  image_url: string;
  category: string;
  city: string;
  created_at: string;
  updated_at: string;
}

export interface Visit {
  id: string;
  location_id: string;
  visited_date: string;
  notes: string;
  rating: number;
  photo_url: string;
  status: string;
  created_at: string;
}

export interface VisitPhoto {
  id: string;
  visit_id: string;
  image_url: string;
  caption: string;
  order: number;
  created_at: string;
}

export interface VisitWithLocation extends Visit {
  location?: Location;
  photos?: VisitPhoto[];
}

export interface LocationWithVisits extends Location {
  visits?: Visit[];
}
