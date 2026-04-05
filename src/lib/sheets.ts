import { Location, Visit, VisitPhoto } from '@/types';

const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || '';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';

const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`;

async function fetchSheet(range: string) {
  const url = `${BASE_URL}/${range}?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${range}`);
  const data = await res.json();
  return data.values || [];
}

function rowsToObjects<T>(rows: string[][]): T[] {
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] || '';
    });
    return obj as T;
  });
}

export async function getLocations(): Promise<Location[]> {
  const rows = await fetchSheet('locations');
  return rowsToObjects<Location>(rows);
}

export async function getVisits(): Promise<Visit[]> {
  const rows = await fetchSheet('visits');
  return rowsToObjects<Visit>(rows);
}

export async function getVisitPhotos(): Promise<VisitPhoto[]> {
  const rows = await fetchSheet('visit_photos');
  return rowsToObjects<VisitPhoto>(rows);
}

export async function getAllData() {
  const [locations, visits, visitPhotos] = await Promise.all([
    getLocations(),
    getVisits(),
    getVisitPhotos(),
  ]);
  return { locations, visits, visitPhotos };
}
