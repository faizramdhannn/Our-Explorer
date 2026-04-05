import { NextRequest, NextResponse } from 'next/server';
import { getSheetsClient } from '@/lib/google-sheets-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { location_id, visited_date, notes, rating, photo_url, status } = body;

    if (!location_id) {
      return NextResponse.json({ error: 'location_id wajib diisi' }, { status: 400 });
    }

    const sheets = await getSheetsClient();
    const now = new Date().toISOString();
    const id = `visit_${Date.now()}`;

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'visits',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            id,
            location_id,
            visited_date || now.split('T')[0],
            notes || '',
            rating || 0,
            photo_url || '',
            status || 'completed',
            now,
          ],
        ],
      },
    });

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}