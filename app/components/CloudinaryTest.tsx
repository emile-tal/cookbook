'use client';

import Image from 'next/image';

export default function CloudinaryTestImage() {
    return (
        <div>
            <h2>Cloudinary Image Test</h2>
            <Image
                src="https://res.cloudinary.com/dnbrb6snn/image/upload/v1743536021/next-app/gipd5yvsoqqsb7efkjm5.jpg"
                alt="Test Cloudinary"
                width={500}
                height={300}
            />
        </div>
    );
}
