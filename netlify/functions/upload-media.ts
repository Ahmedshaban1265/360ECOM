import type { Handler } from '@netlify/functions';
import { adminBucket, adminDb } from './firebaseAdmin';

function base64ToBuffer(dataUrl: string): { buffer: Buffer; contentType: string } {
  // supports both data URLs and raw base64 with contentType provided separately
  if (dataUrl.startsWith('data:')) {
    const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
    if (!match) throw new Error('Invalid data URL');
    const contentType = match[1];
    const base64 = match[2];
    return { buffer: Buffer.from(base64, 'base64'), contentType };
  }
  // Fallback: assume image/png
  return { buffer: Buffer.from(dataUrl, 'base64'), contentType: 'application/octet-stream' };
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    if (!event.body) {
      return { statusCode: 400, body: 'Missing body' };
    }

    const isBase64 = event.isBase64Encoded;
    const bodyStr = isBase64 ? Buffer.from(event.body, 'base64').toString('utf-8') : event.body;
    const payload = JSON.parse(bodyStr);

    const { fileName, fileData, folder = 'theme-media', originalName, contentType } = payload || {};
    if (!fileData || !fileName) {
      return { statusCode: 400, body: 'Missing fileData or fileName' };
    }

    const { buffer, contentType: inferredType } = base64ToBuffer(
      contentType ? `data:${contentType};base64,${fileData}` : fileData
    );

    const bucket = adminBucket();
    const filePath = `${folder}/${fileName}`;
    const file = bucket.file(filePath);

    await file.save(buffer, {
      metadata: { contentType: contentType || inferredType, cacheControl: 'public, max-age=31536000' },
      resumable: false
    });

    const [signedUrl] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 1000 * 60 * 60 * 24 * 7 });

    // Save Firestore record
    const db = adminDb();
    const id = filePath.replace(/\//g, '__');
    await db.collection('media_library_v1').doc(id).set({
      url: signedUrl,
      path: filePath,
      name: fileName,
      originalName: originalName || fileName,
      folder,
      uploadedAt: Date.now()
    }, { merge: true });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: signedUrl, path: filePath, name: fileName, uploadedAt: Date.now() })
    };
  } catch (err: any) {
    console.error('upload-media error', err);
    return { statusCode: 500, body: err?.message || 'Internal Server Error' };
  }
};

