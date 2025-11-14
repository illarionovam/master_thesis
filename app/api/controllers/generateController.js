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

const generateTextResponse = async prompt => {
    const response = await openai.responses.create({
        model: 'gpt-5-nano',
        input: prompt,
    });

    const messageItem = response.output.find(item => item.type === 'message');
    const textBlock = messageItem?.content?.find(c => c.type === 'output_text');
    const text = typeof textBlock?.text === 'string' ? textBlock.text : null;

    if (!text) throw createHttpError(500, 'Synopsis generation failed');

    return text;
};

export const generateDescription = async events => {
    const prompt = `You are a literary editor. Based on the following list of events, generate:
1) A short annotation (2-4 sentences)
2) A short synopsis (5-8 sentences)
Answer in language of the provided data.
Events: ${JSON.stringify(events)}
`;

    return 'test';

    //return generateTextResponse(prompt);
};

export const generateEventFactCheck = async (currentEvent, participants, previousEvents) => {
    const prompt = `
You are a fiction development editor analyzing story consistency.

I will provide:
1) The CURRENT EVENT (description and location_description).
2) PARTICIPANTS (each with name, personality/character, and bio/background).
3) PREVIOUS EVENTS (key events that happened earlier in the story, in chronological order).

Using ONLY this information, do the following:

1) OOC CHECK (Out of Character):
- For each participant, say whether their actions, emotions, or implied behavior in the CURRENT EVENT are in-character or out-of-character (OOC).
- If something feels OOC, explain briefly why, referring to their described character and bio, as well as the PREVIOUS EVENTS.

2) LOGICAL CONTINUITY:
- Explain whether the CURRENT EVENT logically follows from the PREVIOUS EVENTS.
- Comment on whether the characters’ decisions and the situation feel like a natural consequence of what happened before, or if any steps feel rushed, missing, or unjustified.

3) INCONSISTENCIES:
- Point out any obvious contradictions or continuity errors (timeline, physical details, relationships, character motivations, or what characters should/should not know).
- Mention anything that feels like a clear mismatch between CURRENT EVENT, PARTICIPANTS, and PREVIOUS EVENTS.

Answer in language of the provided data and be concise but specific.
Use this structure:

OOC analysis:
- ...

Logical continuity:
- ...

Inconsistencies:
- ...

Your answer should end here. Don't duplicate any data from CURRENT EVENT, PARTICIPANTS, or PREVIOUS EVENTS.

CURRENT EVENT:
${JSON.stringify(currentEvent)}

PARTICIPANTS:
${JSON.stringify(participants)}

PREVIOUS EVENTS:
${JSON.stringify(previousEvents)}
`;

    console.log(prompt);
    //return 'test';
    return generateTextResponse(prompt);
};
