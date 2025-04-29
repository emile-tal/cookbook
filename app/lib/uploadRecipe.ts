export async function uploadRecipe(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-recipe', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload recipe');
    }

    const data = await response.json();
    return data.rawText;
}
