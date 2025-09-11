import type { RequestHandler } from './$types';
import { writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const POST: RequestHandler = async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;

    if (!file) {
        return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const ext = path.extname(file.name) || '';
    const id = crypto.randomUUID();
    const filename = `${id}${ext}`;
    const filepath = path.join('static/uploads', filename);

    await writeFile(filepath, bytes);

    return new Response(JSON.stringify({
        url: `/uploads/${filename}`
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
};
