import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'File wajib diisi' }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary belum dikonfigurasi' }, { status: 500 });
    }

    // Convert file to base64 data URI
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // Generate signature untuk authenticated upload
    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'our-explorer';
    const publicId = `visit_${Date.now()}`;

    const signatureString = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha256').update(signatureString).digest('hex');

    // Upload ke Cloudinary
    const uploadForm = new FormData();
    uploadForm.append('file', dataUri);
    uploadForm.append('api_key', apiKey);
    uploadForm.append('timestamp', String(timestamp));
    uploadForm.append('signature', signature);
    uploadForm.append('folder', folder);
    uploadForm.append('public_id', publicId);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: uploadForm }
    );

    const uploadData = await uploadRes.json();

    if (uploadData.error) {
      throw new Error(uploadData.error.message || 'Upload ke Cloudinary gagal');
    }

    // secure_url adalah direct image URL yang selalu bisa diakses
    const publicUrl = uploadData.secure_url;
    console.log('Cloudinary upload success:', publicUrl);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      webViewLink: publicUrl,
    });
  } catch (err: unknown) {
    console.error('Cloudinary upload error:', err);
    const message = err instanceof Error ? err.message : 'Upload gagal';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}