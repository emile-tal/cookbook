import { NextRequest, NextResponse } from 'next/server';

import FormDataNode from 'form-data';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
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
        `https://raw-text-extractor-10153696170.us-central1.run.app/${endpoint}`,
        outgoingForm,
        {
          headers: outgoingForm.getHeaders(),
          maxBodyLength: Infinity, // important for large files
        }
      );

      return NextResponse.json({ rawText: response.data.rawText });
  } catch (err) {
    console.error('Upload failed', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
