import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { openai } from '../utilities/openai.js';
import { saveFile } from '../utilities/cloudinary.js';
import createHttpError from 'http-errors';
import os from 'node:os';

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

    const tmpDir = os.tmpdir();
    const tempPath = path.join(tmpDir, `${randomUUID()}.${output_format}`);
    await fs.writeFile(tempPath, Buffer.from(b64, 'base64'));

    const url = await saveFile({ path: tempPath });
    return url;
};

export const generateDescription = async events => {
    const prompt = `You are a literary editor. Based on the following list of events, generate:
1) A short annotation (2-4 sentences)
2) A short synopsis (5-8 sentences)
Language: English.
Events: ${JSON.stringify(events)}
`;

    const gen = await openai.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
        max_completion_tokens: 500,
    });

    console.log(gen.choices);
    console.log(gen.choices?.[0]);
    console.log(gen.choices?.[0]?.message);

    const text = gen.choices?.[0]?.message?.content;
    if (!text) throw createHttpError(500, 'Synopsis generation failed');

    return text;
};
