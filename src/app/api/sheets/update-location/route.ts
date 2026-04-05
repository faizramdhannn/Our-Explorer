import { NextRequest, NextResponse } from 'next/server';
import { getSheetsClient } from '@/lib/google-sheets-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, location_name, city, category, location_maps, image_url } = body;

    if (!id) {
      return NextResponse.json({ error: 'id wajib diisi' }, { status: 400 });
    }
    if (!location_name || !city) {
      return NextResponse.json({ error: 'location_name dan city wajib diisi' }, { status: 400 });
    }

    const sheets = await getSheetsClient();
    const now = new Date().toISOString();

    // Ambil semua data locations untuk cari baris yang cocok
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'locations',
    });

    const rows = res.data.values || [];
    if (rows.length < 2) {
      return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
    }

    const headers = rows[0];
    const idColIdx = headers.indexOf('id');
    if (idColIdx === -1) {
      return NextResponse.json({ error: 'Kolom id tidak ditemukan' }, { status: 500 });
    }

    // Cari row index (1-based, +1 karena header)
    const rowIdx = rows.findIndex((row, i) => i > 0 && row[idColIdx] === id);
    if (rowIdx === -1) {
      return NextResponse.json({ error: 'Lokasi tidak ditemukan' }, { status: 404 });
    }

    // Google Sheets row number (1-indexed, +1 for header row offset)
    const sheetRowNumber = rowIdx + 1;

    // Buat row values sesuai urutan kolom header
    const updatedRow = headers.map((h: string) => {
      switch (h) {
        case 'id': return id;
        case 'location_name': return location_name;
        case 'location_maps': return location_maps || '';
        case 'image_url': return image_url || '';
        case 'category': return category || 'Other';
        case 'city': return city;
        case 'created_at': return rows[rowIdx][headers.indexOf('created_at')] || now;
        case 'updated_at': return now;
        default: return rows[rowIdx][headers.indexOf(h)] || '';
      }
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `locations!A${sheetRowNumber}:${String.fromCharCode(65 + headers.length - 1)}${sheetRowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [updatedRow] },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('Update location error:', err);
    const message = err instanceof Error ? err.message : 'Update gagal';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}