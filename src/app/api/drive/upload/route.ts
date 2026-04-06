import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'File wajib diisi' }, { status: 400 });
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // Upload ke ImgBB
    const imgbbApiKey = process.env.IMGBB_API_KEY;
    if (!imgbbApiKey) {
      return NextResponse.json({ error: 'IMGBB_API_KEY belum dikonfigurasi' }, { status: 500 });
    }

    const body = new URLSearchParams();
    body.append('image', base64);
    body.append('name', `visit_${Date.now()}_${file.name}`);

    const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body,
    });

    const uploadData = await uploadRes.json();

    if (!uploadData.success) {
      throw new Error(uploadData.error?.message || 'Upload ke ImgBB gagal');
    }

    const publicUrl = uploadData.data.url;          // direct image URL
    const deleteUrl = uploadData.data.delete_url;   // opsional, untuk hapus nanti

    return NextResponse.json({
      success: true,
      url: publicUrl,
      deleteUrl,
      // backward compat — komponen lama pakai `webViewLink`
      webViewLink: uploadData.data.display_url,
    });
  } catch (err: unknown) {
    console.error('ImgBB upload error:', err);
    const message = err instanceof Error ? err.message : 'Upload gagal';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}