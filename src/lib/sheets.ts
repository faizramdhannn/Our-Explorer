import { Location, Visit, VisitPhoto } from '@/types';

async function fetchSheet(range: string): Promise<string[][]> {
  const res = await fetch(`/api/sheets/${range}`);
  if (!res.ok) throw new Error(`Failed to fetch ${range}`);
  const data = await res.json();
  return data.values || [];
}

function rowsToObjects<T>(rows: string[][]): T[] {
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = row[i] || ''; });
    return obj as T;
  });
}

export async function getLocations(): Promise<Location[]> {
  return rowsToObjects<Location>(await fetchSheet('locations'));
}

export async function getVisits(): Promise<Visit[]> {
  return rowsToObjects<Visit>(await fetchSheet('visits'));
}

export async function getVisitPhotos(): Promise<VisitPhoto[]> {
  return rowsToObjects<VisitPhoto>(await fetchSheet('visit_photos'));
}