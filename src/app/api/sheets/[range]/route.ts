import { NextRequest, NextResponse } from 'next/server';
import { fetchSheetData } from '@/lib/google-sheets-server';

export async function GET(
  _req: NextRequest,
  { params }: { params: { range: string } }
) {
  try {
    const values = await fetchSheetData(params.range);
    return NextResponse.json({ values });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}