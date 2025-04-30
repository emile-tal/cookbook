'use client'

import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Recipe } from "@/app/lib/definitions";
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
            onRecipeImported(parsedRecipeData);
        } catch (err) {
            setError('Failed to upload recipe. Please try again.');
            console.error('Upload error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-4">
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