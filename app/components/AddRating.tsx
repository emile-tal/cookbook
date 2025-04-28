'use client'

import { addRating, removeRating } from '@/app/lib/data/rating'

import ClearIcon from '@mui/icons-material/Clear'
import { Rating } from '@mui/material'
import { useState } from 'react'

export default function AddRating({ recipeId, userRating, loggedIn }: { recipeId: string, userRating: number | null, loggedIn: boolean }) {
    const [selectedRating, setSelectedRating] = useState<number | null>(userRating)

    const addUserRating = async (rating: number) => {
        await addRating(recipeId, rating)
    }

    const removeUserRating = async () => {
        await removeRating(recipeId)
    }

    const handleRatingChange = (_: React.SyntheticEvent<Element, Event>, newValue: number | null) => {
        if (loggedIn) {
            setSelectedRating(newValue)
            if (newValue === null) {
                removeUserRating()
            } else {
                addUserRating(newValue)
            }
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Rating
                value={selectedRating}
                onChange={handleRatingChange}
                precision={0.5}
                size="large"
                sx={{
                    '& .MuiRating-iconFilled': {
                        color: '#D72638',
                    },
                    '& .MuiRating-iconHover': {
                        color: '#D72638',
                        opacity: 0.8,
                    },
                }}
            />
            {selectedRating !== null && (
                <button
                    onClick={(e) => handleRatingChange(e, null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear rating"
                >
                    <ClearIcon fontSize="small" />
                </button>
            )}
        </div>
    )
}