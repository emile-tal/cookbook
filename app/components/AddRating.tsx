'use client'

import { addRating, removeRating } from '@/app/lib/data/rating'

import ClearIcon from '@mui/icons-material/Clear'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'
import { useState } from 'react'

export default function AddRating({ recipeId, userRating }: { recipeId: string, userRating: number | null }) {
    const [hoverRating, setHoverRating] = useState<number | null>(null)
    const [selectedRating, setSelectedRating] = useState<number | null>(userRating)

    const addUserRating = async (rating: number) => {
        await addRating(recipeId, rating)
    }

    const removeUserRating = async () => {
        await removeRating(recipeId)
    }

    const handleStarHover = (starIndex: number) => {
        setHoverRating(starIndex + 1)
    }

    const handleStarClick = (starIndex: number) => {
        const rating = starIndex + 1
        setSelectedRating(rating)
        addUserRating(rating)
    }

    const handleClearRating = () => {
        setSelectedRating(null)
        removeUserRating()
    }

    const renderStar = (index: number) => {
        const starValue = index + 1
        const currentRating = hoverRating !== null ? hoverRating : selectedRating

        return (
            <div
                key={index}
                className="cursor-pointer"
                onMouseEnter={() => handleStarHover(index)}
                onMouseLeave={() => setHoverRating(null)}
                onClick={() => handleStarClick(index)}
            >
                {currentRating !== null && currentRating >= starValue ? (
                    <StarIcon className="text-primary" />
                ) : (
                    <StarBorderIcon className="text-gray-300" />
                )}
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => renderStar(index))}
            </div>
            {selectedRating !== null && (
                <button
                    onClick={handleClearRating}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear rating"
                >
                    <ClearIcon fontSize="small" />
                </button>
            )}
        </div>
    )
}