'use client'

import { CSS } from '@dnd-kit/utilities'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { Ingredient } from "@/app/types/definitions"
import { useSortable } from '@dnd-kit/sortable'

interface SortableIngredientProps {
    ingredient: Ingredient
    index: number
    onUpdate: (position: number, ingredient: string, amount: string) => void
    onRemove: (position: number) => void
    hoveredIngredient: number | null
    setHoveredIngredient: (position: number | null) => void
    isLastEmpty: boolean
}

export function SortableIngredient({
    ingredient,
    index,
    onUpdate,
    onRemove,
    hoveredIngredient,
    setHoveredIngredient,
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
        id: ingredient.position,
        disabled: isLastEmpty
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: isLastEmpty ? 'default' : (isDragging ? 'grabbing' : 'grab')
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="grid grid-cols-12 gap-2 items-center mb-2 relative"
            onMouseEnter={() => setHoveredIngredient(ingredient.position)}
            onMouseLeave={() => setHoveredIngredient(null)}
            {...attributes}
            {...listeners}
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
                className={`block min-w-full rounded-md border border-gray-300 px-3 py-2 col-span-2 focus-visible:ring-1 focus-visible:ring-primary focus:outline-none ${!ingredient.amount && !ingredient.ingredient ? 'bg-gray-100' : 'bg-white'}`}
            />
            <input
                type="text"
                name={`ingredient_name_${index}`}
                value={ingredient.ingredient}
                onChange={(e) => onUpdate(ingredient.position, e.target.value, ingredient.amount)}
                className={`block min-w-full rounded-md border border-gray-300 px-3 py-2 col-span-9 focus-visible:ring-1 focus-visible:ring-primary focus:outline-none ${!ingredient.amount && !ingredient.ingredient ? 'bg-gray-100' : 'bg-white'}`}
            />
            <div className="col-span-1 flex justify-center items-center">
                {!isLastEmpty && <DragHandleIcon />}
            </div>
            <button
                type="button"
                onClick={() => onRemove(ingredient.position)}
                className="text-rose-300 hover:text-rose-500 flex justify-center items-center absolute right-[-2.5rem] top-[0.5rem]"
                tabIndex={-1}
            >
                <DeleteOutlineIcon />
            </button>
        </div>
    )
} 