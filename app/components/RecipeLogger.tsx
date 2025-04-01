'use client';

import { logRecipeView } from '@/app/actions/logs';
import { useEffect } from 'react';

export default function RecipeLogger({ recipeId }: { recipeId: string }) {
    useEffect(() => {
        logRecipeView(recipeId);
    }, [recipeId]);

    return null;
} 