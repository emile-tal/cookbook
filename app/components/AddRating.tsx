'use client'

import { addRating, removeRating } from '@/app/lib/data/rating'

import ClearIcon from '@mui/icons-material/Clear'
import Loading from '../ui/loading'
import { Rating } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function AddRating({ recipeId, userRating }: { recipeId: string, userRating: number | null }) {
    const [selectedRating, setSelectedRating] = useState<number | null>(userRating)
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <Loading size={8} />
    }

    const addUserRating = async (rating: number) => {
        await addRating(recipeId, rating)
    }

    const removeUserRating = async () => {
        await removeRating(recipeId)
    }

    const handleRatingChange = (_: React.SyntheticEvent<Element, Event>, newValue: number | null) => {
        if (session) {
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