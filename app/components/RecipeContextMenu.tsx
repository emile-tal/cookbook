'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface RecipeContextMenuProps {
    position: { x: number, y: number },
    recipeId: string,
    onClose: () => void,
    fullUrl: string,
    saved: boolean,
    handleSave: (recipeId: string) => void,
    shareHandler: () => void,
    editable: boolean,
    shareable: boolean
}

const RecipeContextMenu = forwardRef<HTMLDivElement, RecipeContextMenuProps>(({ position, recipeId, onClose, fullUrl, saved, handleSave, shareHandler, editable, shareable }, ref) => {
    const router = useRouter();
    const localRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();

    useImperativeHandle(ref, () => localRef.current!, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (localRef.current && !localRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [onClose]);


    return (
        <div ref={localRef} className="absolute z-50 bg-white rounded-md shadow-lg border border-gray-200 min-w-[160px]" style={{ left: position.x, top: position.y }}>
            <ul>
                {editable && <li
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => router.push(`/recipe/${recipeId}/edit?from=${fullUrl}`)}
                >
                    Edit Recipe
                </li>}
                {session && <li
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSave(recipeId)}
                >
                    {saved ? "Unsave Recipe" : "Save Recipe"}
                </li>}
                {shareable && <li
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={shareHandler}
                >
                    Share Recipe
                </li>}
            </ul>
        </div>
    )
})

RecipeContextMenu.displayName = 'RecipeContextMenu';

export default RecipeContextMenu;