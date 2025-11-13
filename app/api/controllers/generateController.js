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

    const response = await openai.responses.create({
        model: 'gpt-5-nano',
        input: prompt,
    });

    return 'Annotation:\nOn a university campus, Max’s orbit strands around Viktor and Anton as they navigate fear, memory, and growing trust. A nightmarish trip, a rescue, and a cascade of intimate conversations push their bond beyond friendship into something deeper. The seven-year ending offers a quiet, hopeful reconciliation with the past.\n\nSynopsis:\nMax arrives on the Ruhr campus and quickly becomes entwined with Anton and Viktor. A storm during a class triggers Viktor’s anxiety, and Max stays by him, laying the foundation for trust. At a club, Anton drags Max there where a girl discreetly hands him LSD, sending him into a harrowing trip that Viktor rescues him from. The morning after, they speak openly in the kitchen, and a winter night deepens their connection as Max helps Viktor through a panicked episode. A campus concert becomes a shared moment of vulnerability, but Sonya’s rumor about Tina and Max sparks a fight that tests their loyalties. Then comes the tragedy: Max learns his mother has died, and Viktor helps him leave Brodston to start living together. The danger escalates when Slava, Igor’s nephew, attempts to rape Max, but Viktor arrives in time to stop him, forcing them to confront their pasts and their bond. Seven years later, in a rainy, quiet Ruhrish, Max and Viktor walk side by side under an umbrella, a steadfast sign of peace.';

    const messageItem = response.output.find(item => item.type === 'message');
    const textBlock = messageItem?.content?.find(c => c.type === 'output_text');
    const text = typeof textBlock?.text === 'string' ? textBlock.text : null;

    if (!text) throw createHttpError(500, 'Synopsis generation failed');

    return text;
};
