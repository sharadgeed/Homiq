import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { jsonResponse, errorResponse } from '@/lib/api-response';
import fs from 'fs';
import path from 'path';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return errorResponse('No file uploaded', 400);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return errorResponse(`Invalid file type (${file.type}). Allowed: JPG, PNG, WEBP, PDF`, 400);
    }

    if (file.size > MAX_SIZE_BYTES) {
      return errorResponse('File size exceeds 5MB limit', 400);
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'pdf'].includes(ext) ? ext : 'jpg';
    const safeName = `hmq_${user.id.substring(4)}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${safeExt}`;
    const filePath = path.join(uploadDir, safeName);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;

    return jsonResponse({
      success: true,
      url: publicUrl,
      fileName: safeName,
      size: file.size,
      mimeType: file.type,
    }, 201);
  } catch (err: any) {
    return errorResponse(err.message || 'File upload failed', 500);
  }
}
