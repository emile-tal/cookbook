'use client'

import { uploadRecipe } from "../lib/uploadRecipe";
import { useState } from "react";

export default function NewRecipe() {
    const [file, setFile] = useState<File | null>(null)

    const handleRecipeUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (file) {
            const rawtext = await uploadRecipe(file);
            console.log(rawtext);
        }
    }

    return (
        <div className="container mx-auto">
            <h1>New Recipe</h1>
            <form onSubmit={handleRecipeUpload}>
                <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <button type="submit">Upload</button>
            </form>
        </div>
    );

}