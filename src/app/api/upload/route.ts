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

    const photosDir = path.join(process.cwd(), 'public', 'media', 'photos');
    const videosDir = path.join(process.cwd(), 'public', 'media', 'videos');

    try {
      if (!fs.existsSync(photosDir)) {
        fs.mkdirSync(photosDir, { recursive: true });
      }
      if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir, { recursive: true });
      }
    } catch {}

    const results: { url: string; filename: string; isVideo: boolean }[] = [];

    for (const file of allFiles) {
      const isVideo = file.type?.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi)$/i.test(file.name);
      const targetDir = isVideo ? videosDir : photosDir;
      const urlPrefix = isVideo ? '/media/videos' : '/media/photos';
      const filePrefix = isVideo ? 'video' : 'photo';

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const timestamp = Date.now() + Math.floor(Math.random() * 1000);
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${filePrefix}_${timestamp}_${sanitizedName}`;

      let writtenToDisk = false;
      try {
        const filePath = path.join(targetDir, filename);
        fs.writeFileSync(filePath, buffer);
        results.push({
          url: `${urlPrefix}/${filename}`,
          filename,
          isVideo,
        });
        writtenToDisk = true;
      } catch {
        writtenToDisk = false;
      }

      if (!writtenToDisk) {
        // Fallback for Vercel / serverless: Data URL format
        const mimeType = file.type || (isVideo ? 'video/mp4' : 'image/jpeg');
        const base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`;
        results.push({
          url: base64Data,
          filename,
          isVideo,
        });
      }
    }

    return NextResponse.json({
      urls: results.map((r) => r.url),
      files: results,
      url: results[0]?.url,
      filename: results[0]?.filename,
      isVideo: results[0]?.isVideo,
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ error: "Échec de l'upload des fichiers" }, { status: 500 });
  }
}
