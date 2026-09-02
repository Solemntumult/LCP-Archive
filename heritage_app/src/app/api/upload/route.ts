import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;

    const allFiles: File[] = [];
    if (files && files.length > 0) {
      allFiles.push(...files);
    } else if (singleFile) {
      allFiles.push(singleFile);
    }

    if (allFiles.length === 0) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'media', 'photos');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const results: { url: string; filename: string }[] = [];

    for (const file of allFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const timestamp = Date.now() + Math.floor(Math.random() * 1000);
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `photo_${timestamp}_${sanitizedName}`;
      const filePath = path.join(uploadsDir, filename);

      fs.writeFileSync(filePath, buffer);
      results.push({
        url: `/media/photos/${filename}`,
        filename,
      });
    }

    return NextResponse.json({
      urls: results.map((r) => r.url),
      files: results,
      url: results[0]?.url,
      filename: results[0]?.filename,
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ error: "Échec de l'upload des photos" }, { status: 500 });
  }
}
