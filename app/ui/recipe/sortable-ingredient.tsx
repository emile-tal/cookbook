'use client'

import { CSS } from '@dnd-kit/utilities'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { Ingredient } from "@/app/types/definitions"
import { useSortable } from '@dnd-kit/sortable'

interface SortableIngredientProps {
    ingredient: Ingredient
    index: number
    onUpdate: (position: number, ingredient: string, amount: string) => void
    isLastEmpty: boolean
}

export function SortableIngredient({
    ingredient,
    index,
    onUpdate,
    isLastEmpty
}: SortableIngredientProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: ingredient.id,
        disabled: isLastEmpty
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="grid grid-cols-12 gap-2 items-center mb-2 relative"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Tab') {
                    e.preventDefault()
                    const inputs = e.currentTarget.querySelectorAll('input')
                    const currentInput = document.activeElement
                    const currentIndex = Array.from(inputs).indexOf(currentInput as HTMLInputElement)

                    if (e.shiftKey) {
                        if (currentIndex >= 0) {
                            inputs[currentIndex - 1].focus()
                        } else {
                            const prevRow = e.currentTarget.previousElementSibling
                            if (prevRow) {
                                const prevInputs = prevRow.querySelectorAll('input')
                                prevInputs[prevInputs.length - 1].focus()
                            }
                        }
                    } else {
                        if (currentIndex < inputs.length - 1) {
                            inputs[currentIndex + 1].focus()
                        } else {
                            const nextRow = e.currentTarget.nextElementSibling
                            if (nextRow) {
                                const nextInputs = nextRow.querySelectorAll('input')
                                nextInputs[0].focus()
                            }
                        }
                    }
                }
            }}
        >
            <input
                type="text"
                name={`ingredient_amount_${index}`}
                value={ingredient.amount}
                onChange={(e) => onUpdate(ingredient.position, ingredient.ingredient, e.target.value)}
                className={`block min-w-full rounded-md border border-gray-300 px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base col-span-3 sm:col-span-2 focus-visible:ring-1 focus-visible:ring-primary focus:outline-none ${!ingredient.amount && !ingredient.ingredient ? 'bg-gray-100' : 'bg-white'}`}
            />
            <input
                type="text"
                name={`ingredient_name_${index}`}
                value={ingredient.ingredient}
                onChange={(e) => onUpdate(ingredient.position, e.target.value, ingredient.amount)}
                className={`block min-w-full rounded-md border border-gray-300 px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base col-span-7 sm:col-span-9 focus-visible:ring-1 focus-visible:ring-primary focus:outline-none ${!ingredient.amount && !ingredient.ingredient ? 'bg-gray-100' : 'bg-white'}`}
            />
            <div
                className={`col-span-2 sm:col-span-1 flex justify-center items-center gap-1 sm:gap-2 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                {...attributes}
                {...listeners}
            >
                {!isLastEmpty && <DragHandleIcon className="text-gray-400 text-lg sm:text-xl" />}
            </div>
        </div>
    )
} 