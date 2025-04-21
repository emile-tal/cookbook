'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function EmptyBook({ bookName, canEdit }: { bookName: string, canEdit: boolean }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const fullUrl = pathname + '?' + searchParams.toString();


    return (
        <div>
            <h1 className="text-2xl font-bold my-4">{bookName}</h1>
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
                <MenuBookIcon className="text-gray-300 scale-[200%] min-h-16 w-16" />
                {canEdit ? (
                    <>
                        <p className="text-gray-600 text-lg mb-4 pt-4">{`You don't have any recipes in this book yet.`}</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => router.push(`/recipe/add?from=${fullUrl}`)}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
                            >
                                Add a recipe
                            </button>
                            <button
                                onClick={() => router.push(`/`)}
                                className="px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors"
                            >
                                Find recipes
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-600 text-lg mb-4 pt-4">There are no recipes in this book yet.</p>
                )}
            </div>
        </div>
    )
}