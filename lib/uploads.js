import 'server-only';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';

const allowed = new Set(['image/jpeg','image/png','image/webp','application/pdf','text/plain','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']);

export function validateUpload(file) {
  if (!file || typeof file.arrayBuffer !== 'function' || file.size === 0) return null;
  const max = Number(process.env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024;
  if (file.size > max) throw new Error(`File exceeds the ${process.env.MAX_FILE_SIZE_MB || 10} MB limit.`);
  if (!allowed.has(file.type)) throw new Error('Unsupported file type. Use JPG, PNG, WebP, PDF, TXT, DOCX, or XLSX.');
  return file;
}

export async function saveUpload(file) {
  validateUpload(file);
  if (process.env.UPLOAD_PROVIDER === 'cloudinary') return saveCloudinary(file);
  if (process.env.NODE_ENV === 'production') {
    console.warn('Local uploads are ephemeral on many hosts. Configure UPLOAD_PROVIDER=cloudinary for production.');
  }
  const uploadDir = process.env.UPLOAD_DIR || 'public/uploads';
  const absolute = path.join(/* turbopackIgnore: true */ process.cwd(), uploadDir);
  await mkdir(absolute, { recursive: true });
  const clean = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const fileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${clean}`;
  await writeFile(path.join(absolute, fileName), Buffer.from(await file.arrayBuffer()));
  return { url: `/${uploadDir.replace(/^public\/?/, '')}/${fileName}`, fileName, originalName: file.name, mimeType: file.type, size: file.size };
}

async function saveCloudinary(file) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  const buffer = Buffer.from(await file.arrayBuffer());
  const resourceType = file.type === 'application/pdf' ? 'raw' : 'auto';
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: process.env.CLOUDINARY_FOLDER || 'jetwash', resource_type: resourceType }, (error, response) => error ? reject(error) : resolve(response));
    stream.end(buffer);
  });
  return { url: result.secure_url, fileName: result.public_id, originalName: file.name, mimeType: file.type, size: file.size };
}
