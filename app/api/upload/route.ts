import { NextRequest, NextResponse } from 'next/server';

import { Readable } from 'stream';
import cloudinary from '../../lib/cloudinary';

interface CloudinaryUploadResult {
    secure_url: string;
    [key: string]: any;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult: CloudinaryUploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'next-app' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result as CloudinaryUploadResult);
                }
            );

            const stream = Readable.from(buffer);
            stream.pipe(uploadStream);
        });

        return NextResponse.json({ url: uploadResult.secure_url });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
