'use client'

import { useRef, useState } from "react";

import { EditIcon } from "lucide-react";
import Image from "next/image";
import { Person } from "@mui/icons-material";
import { User } from "@/app/types/definitions";
import { updateUserImage } from "@/app/lib/data/user";
import { uploadImage } from "@/app/lib/uploadImage";
import { useRouter } from "next/navigation";

export default function ProfilePhoto({ userData }: { userData: User }) {
    const [isUploading, setIsUploading] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter();

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const imageUrl = await uploadImage(file);
            await updateUserImage(userData.id, imageUrl);
        } catch (error) {
            console.error('Failed to upload image:', error);
        } finally {
            setIsUploading(false);
            router.refresh();
        }
    }

    const handleImageClick = () => {
        fileInputRef.current?.click();
    }

    return (
        <div className="relative">
            <input
                ref={fileInputRef}
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
            />
            <div
                className="min-w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center relative hover:cursor-pointer"
                onClick={handleImageClick}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {userData.user_image_url ? (
                    <Image
                        src={userData.user_image_url}
                        alt="User avatar"
                        fill
                        className={`object-cover transition-opacity duration-200 ${isHovering ? 'opacity-75' : 'opacity-100'}`}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <Person className="text-gray-400 text-2xl mb-1 scale-[175%]" />
                    </div>
                )}
                {isHovering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <EditIcon className="text-white text-2xl" />
                    </div>
                )}
                {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <p className="text-white text-xs">Uploading...</p>
                    </div>
                )}
            </div>
        </div>
    )
}