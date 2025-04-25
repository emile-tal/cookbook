'use client'

import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { Ingredient } from "@/app/types/definitions"
import { SortableIngredient } from './sortable-ingredient'

interface DynamicIngredientsFormProps {
    ingredients: Ingredient[]
    setIngredients: (ingredients: Ingredient[]) => void
}

export default function DynamicIngredientsForm({ ingredients, setIngredients }: DynamicIngredientsFormProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const updateIngredient = (position: number, ingredient: string, amount: string) => {
        let updatedIngredients = ingredients.map((ing) =>
            ing.position === position ? { ...ing, ingredient, amount } : ing
        )

        // Add new row if this is the last row and ingredient field has content
        if (position === ingredients.length && ingredient) {
            updatedIngredients.push({
                id: crypto.randomUUID(),
                position: position + 1,
                amount: '',
                ingredient: ''
            })
        }

        // Remove the last empty row if the previous row is now empty
        if (position === ingredients.length - 1 && !ingredient && !amount) {
            updatedIngredients = updatedIngredients.filter((_, idx) => idx !== updatedIngredients.length - 1)
        }

        setIngredients(updatedIngredients)
    }

    const removeIngredient = (position: number) => {
        const updatedIngredients = ingredients
            .filter(ing => ing.position !== position)
            .map((ing, idx) => ({ ...ing, position: idx + 1 }))
        setIngredients(updatedIngredients)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            const oldIndex = ingredients.findIndex((item) => item.id === active.id)
            const newIndex = ingredients.findIndex((item) => item.id === over?.id)

            const newItems = arrayMove(ingredients, oldIndex, newIndex)
            setIngredients(newItems.map((item, index) => ({ ...item, position: index + 1 })))
        }
    }

    return (
        <div className="py-4">
            <label htmlFor="ingredients" className="hidden">Ingredients</label>
            <div className="grid grid-cols-12 gap-2 mb-2">
                <span className="col-span-2 text-sm">Quantity</span>
                <span className="col-span-9 text-sm">Ingredient</span>
                <span className="col-span-1"></span>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={ingredients.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {ingredients.sort((a, b) => a.position - b.position).map((ingredient, index) => (
                        <SortableIngredient
                            key={ingredient.id}
                            ingredient={ingredient}
                            index={index}
                            onUpdate={updateIngredient}
                            onRemove={removeIngredient}
                            isLastEmpty={index === ingredients.length - 1 && !ingredient.ingredient && !ingredient.amount}
                        />
                    ))}
                </SortableContext>
            </DndContext>
            <input type="hidden" name="ingredients" value={JSON.stringify(ingredients)} />
        </div>
    )
} 