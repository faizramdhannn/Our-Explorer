import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

async function getDriveClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });
  return google.drive({ version: 'v3', auth });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const visitId = formData.get('visitId') as string;

    if (!file) {
      return NextResponse.json({ error: 'File wajib diisi' }, { status: 400 });
    }

    const drive = await getDriveClient();

    // Convert File to Buffer → Readable stream
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = Readable.from(buffer);

    // Folder ID dari env (opsional - jika tidak ada, upload ke root Drive)
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    const fileMetadata: Record<string, unknown> = {
      name: `visit_${visitId}_${Date.now()}_${file.name}`,
    };
    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    const uploaded = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: file.type || 'image/jpeg',
        body: stream,
      },
      fields: 'id, name, webViewLink, webContentLink',
    });

    const fileId = uploaded.data.id!;

    // Jadikan file bisa diakses publik (anyone with link can view)
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // URL langsung untuk embed/img tag
    const publicUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

    return NextResponse.json({
      success: true,
      fileId,
      url: publicUrl,
      webViewLink: uploaded.data.webViewLink,
    });
  } catch (err: unknown) {
    console.error('Drive upload error:', err);
    const message = err instanceof Error ? err.message : 'Upload gagal';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}