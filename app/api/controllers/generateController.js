import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

import { openai } from '../utilities/openai.js';
import { saveFile } from '../utilities/cloudinary.js';
import createHttpError from 'http-errors';

export const generateAndUploadImage = async (prompt, options = {}) => {
    const size = options.size ?? '1024x1536';
    const quality = options.quality ?? 'medium';
    const output_format = options.format ?? 'png';

    const gen = await openai.images.generate({
        model: 'gpt-image-1-mini',
        prompt,
        size,
        quality,
        output_format,
    });

    const b64 = gen.data?.[0]?.b64_json;
    if (!b64) throw createHttpError(500, 'Image generation failed');

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const tmpDir = path.join(__dirname, '..', '..', 'tmp');
    await fs.mkdir(tmpDir, { recursive: true });

    const tempPath = path.join(tmpDir, `${randomUUID()}.${output_format}`);
    await fs.writeFile(tempPath, Buffer.from(b64, 'base64'));

    const url = await saveFile({ path: tempPath });
    return url;
};
