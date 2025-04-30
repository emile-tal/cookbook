import { NextRequest, NextResponse } from 'next/server';

import FormDataNode from 'form-data';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file !== 'object' || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const outgoingForm = new FormDataNode();
    outgoingForm.append('file', buffer, {
      filename: file.name,
      contentType: file.type,
      knownLength: buffer.length,
    });

    const isImage = file.type.startsWith('image/');
    const endpoint = isImage ? 'upload-image' : 'upload-pdf';

    const response = await axios.post(
        `${process.env.RAW_TEXT_EXTRACTOR_API_URL}/${endpoint}`,
        outgoingForm,
        {
          headers: outgoingForm.getHeaders(),
          maxBodyLength: Infinity,
        }
      );

      return NextResponse.json({ rawText: response.data.rawText });
  } catch (err) {
    console.error('Upload failed', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
