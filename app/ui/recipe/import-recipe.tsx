'use client'

import { ImportedRecipe, Recipe } from "@/app/types/definitions";

import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { poppins } from "../fonts";
import { uploadRecipe } from "@/app/lib/uploadRecipe";
import { useState } from "react";

interface ImportRecipeProps {
    onRecipeImported: (recipe: Recipe) => void;
}

export default function ImportRecipe({ onRecipeImported }: ImportRecipeProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatRecipe = (parsed: ImportedRecipe): Recipe => {
        return {
            id: '',
            title: parsed.title || '',
            description: parsed.description || '',
            categories: parsed.categories || [],
            duration: parsed.duration ?? 0,
            recipe_yield: parsed.recipe_yield ?? 0,
            image_url: '',
            username: '',
            is_public: false,
            average_rating: {
                average_rating: 0,
                num_ratings: 0,
            },
            ingredients: (parsed.ingredients || []).map((ing: { position: number, amount: string, ingredient: string }, index: number) => ({
                id: crypto.randomUUID(),
                position: ing.position ?? index + 1,
                amount: ing.amount || '',
                ingredient: ing.ingredient || '',
            })),
            instructions: (parsed.instructions || []).map((inst: { position: number, instruction: string }, index: number) => ({
                id: crypto.randomUUID(),
                position: inst.position ?? index + 1,
                instruction: inst.instruction || '',
            })),
        };
    }


    const handleRecipeUpload = async (selectedFile: File) => {
        try {
            setIsLoading(true);
            setError(null);
            const rawtext = await uploadRecipe(selectedFile);
            const parsedRecipe = await fetch('/api/parse-recipe', {
                method: 'POST',
                body: JSON.stringify({ rawText: rawtext }),
            });
            const parsedRecipeData = await parsedRecipe.json();
            const formattedRecipe = formatRecipe(parsedRecipeData);
            onRecipeImported(formattedRecipe);
        } catch (err) {
            setError('Failed to upload recipe. Please try again.');
            console.error('Upload error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-4 max-w-screen-sm mx-auto">
            <div className="relative">
                <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) {
                            setFile(selectedFile);
                            setError(null);
                            handleRecipeUpload(selectedFile);
                        }
                    }}
                    className="hidden"
                    id="recipe-file"
                    disabled={isLoading}
                />
                <label
                    htmlFor="recipe-file"
                    className={`block w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${isLoading ? 'border-gray-300 bg-gray-50' : 'border-gray-300 hover:border-primary'
                        }`}
                >
                    <div className="flex items-center justify-center text-center">
                        {isLoading ? (
                            <CircularProgress size={20} className="mr-2" />
                        ) : (
                            <CloudUploadIcon className="text-gray-400 text-xl mr-2" />
                        )}
                        <p className={`text-gray-500 ${poppins.className}`}>
                            {file ? file.name : 'Upload recipe (PDF or image)'}
                        </p>
                    </div>
                </label>
            </div>

            {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
            )}
        </div>
    );
}