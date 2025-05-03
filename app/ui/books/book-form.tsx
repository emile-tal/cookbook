'use client'

import { useActionState, useRef, useState } from "react";

import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { BackButton } from "../buttons/back-button";
import { Book } from '@/app/types/definitions';
import DeleteDialog from "@/app/components/DeleteDialog";
import EditIcon from '@mui/icons-material/Edit';
import EditTitle from "@/app/components/EditTitle";
import Image from "next/image";
import PrimaryButton from "../buttons/primary-button";
import SecondaryButton from "../buttons/secondary-button";
import { Switch } from "@mui/material";
import { deleteBook } from "@/app/lib/data/recipebooks";
import { uploadImage } from "@/app/lib/uploadImage";
import { useRouter } from "next/navigation";

type FormState = {
    errors: {
        message?: string[];
        id?: string[];
        image_url?: string[];
        name?: string[];
        is_public?: string[];
    };
    message?: string;
} | null;

interface Props {
    formAction: (formData: FormData) => Promise<FormState | void>;
    book: Book;
}

export default function BookForm({ formAction, book }: Props) {
    const [name, setName] = useState(book.name);
    const [imageUrl, setImageUrl] = useState<string | null>(book.image_url || null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const router = useRouter();
    const formActionWithState = async (prevState: FormState, formData: FormData): Promise<FormState> => {
        const result = await formAction(formData);
        return result || null;
    };

    const [state, action] = useActionState(formActionWithState, null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setIsUploading(true)
            const url = await uploadImage(file)
            setImageUrl(url)
        } catch (error) {
            console.error('Failed to upload image:', error)
        } finally {
            setIsUploading(false)
        }
    }

    const handleImageClick = () => {
        fileInputRef.current?.click();
    }

    const handleDelete = async (bookId: string) => {
        await deleteBook(bookId)
        router.push('/books')
        router.refresh()
    }

    return (
        <form action={action} className="flex flex-col gap-4 relative">
            <div className="flex gap-2 items-center">
                <div className="md:absolute md:top-[6.25px] md:left-[-40px]">
                    <BackButton />
                </div>
                <input type="hidden" name="name" value={name} />
                <EditTitle title={name} onChange={setName} />
            </div>
            {state?.message && (
                <div className="text-red-500">{state.message}</div>
            )}
            <div className="w-full">
                <input type="hidden" name="id" value={book.id} />
                <label htmlFor="image" className="hidden">Book Image</label>
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
                    {imageUrl ? (
                        <div
                            className="relative w-full h-64 cursor-pointer group"
                            onClick={handleImageClick}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <Image
                                src={imageUrl}
                                alt="Recipe preview"
                                fill
                                className={`object-cover rounded-lg transition-opacity duration-200 ${isHovering ? 'opacity-75' : 'opacity-100'}`}
                            />
                            {isHovering && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <EditIcon className="text-white text-4xl" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors duration-200"
                            onClick={handleImageClick}
                        >
                            <AddAPhotoIcon className="text-gray-400 text-4xl mb-2" />
                            <p className="text-gray-500">Click to upload book image</p>
                        </div>
                    )}
                    {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <p className="text-white">Uploading image...</p>
                        </div>
                    )}
                </div>
                <input type="hidden" name="image_url" value={imageUrl || ''} />
            </div>
            <div>
                <div className="flex items-center">
                    <Switch
                        name="is_public"
                        defaultChecked={book?.is_public ?? true}
                        color="primary"
                    />
                    <label className="text-sm font-medium ml-2">
                        Make book public
                    </label>
                </div>
            </div>
            <div className="flex justify-between">
                <SecondaryButton text="Delete" onClick={() => setOpenDeleteDialog(true)} />
                <div className="flex flex-end gap-2">
                    <SecondaryButton text="Cancel" onClick={() => router.back()} />
                    <PrimaryButton text="Save" type="submit" />
                </div>
            </div>
            <DeleteDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onDelete={() => {
                    handleDelete(book.id)
                }}
                itemName="Book"
            />
        </form>
    )
}