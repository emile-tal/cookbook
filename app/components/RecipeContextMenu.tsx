'use client'

import { useEffect, useRef } from "react";

import { addSavedRecipe } from "../lib/data/recipes";
import { removeSavedRecipe } from "../lib/data/recipes";
import { useRouter } from "next/navigation";

interface RecipeContextMenuProps {
    position: { x: number, y: number },
    recipeId: string,
    onClose: () => void,
    fullUrl: string,
    saved: boolean,
    handleSave: (recipeId: string) => void
}

export default function RecipeContextMenu({ position, recipeId, onClose, fullUrl, saved, handleSave }: RecipeContextMenuProps) {
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [onClose]);


    return (
        <div ref={menuRef} className="absolute z-50 bg-white rounded-md shadow-lg border border-gray-200 min-w-[160px]" style={{ left: position.x, top: position.y }}>
            <ul>
                <li
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => router.push(`/recipe/${recipeId}/edit?from=${fullUrl}`)}
                >
                    Edit Recipe
                </li>
                <li
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSave(recipeId)}
                >
                    {saved ? "Unsave Recipe" : "Save Recipe"}
                </li>
            </ul>
        </div>
    )
}