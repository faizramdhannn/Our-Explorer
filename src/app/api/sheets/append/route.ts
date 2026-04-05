import { NextRequest, NextResponse } from 'next/server';
import { getSheetsClient } from '@/lib/google-sheets-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { location_name, city, category, location_maps, image_url } = body;

    if (!location_name || !city) {
      return NextResponse.json(
        { error: 'location_name dan city wajib diisi' },
        { status: 400 }
      );
    }

    const sheets = await getSheetsClient();
    const now = new Date().toISOString();
    const id = `loc_${Date.now()}`;

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'locations',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            id,
            location_name,
            location_maps || '',
            image_url || '',
            category || 'Other',
            city,
            now,
            now,
          ],
        ],
      },
    });

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    console.error('Append error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}