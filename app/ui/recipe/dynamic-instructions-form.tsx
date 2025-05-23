'use client'

import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { Instruction } from "@/app/types/definitions"
import { SortableInstruction } from './sortable-instruction'

interface DynamicInstructionsFormProps {
    instructions: Instruction[]
    setInstructions: (instructions: Instruction[]) => void
}

export default function DynamicInstructionsForm({ instructions, setInstructions }: DynamicInstructionsFormProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const updateInstruction = (position: number, instruction: string) => {
        let updatedInstructions = instructions.map(inst =>
            inst.position === position ? { ...inst, instruction } : inst
        )

        // Add new row if this is the last row and has content
        if (position === instructions.length && instruction) {
            updatedInstructions.push({
                id: crypto.randomUUID(),
                position: position + 1,
                instruction: ''
            })
        }

        // Remove the last empty row if the previous row is now empty
        if (position === instructions.length - 1 && !instruction) {
            updatedInstructions = updatedInstructions.filter((_, idx) => idx !== updatedInstructions.length - 1)
        }

        setInstructions(updatedInstructions)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            const oldIndex = instructions.findIndex((item) => item.id === active.id)
            const newIndex = instructions.findIndex((item) => item.id === over?.id)

            const newItems = arrayMove(instructions, oldIndex, newIndex)
            setInstructions(newItems.map((item, index) => ({ ...item, position: index + 1 })))
        }
    }

    return (
        <div className="py-4">
            <label htmlFor="instructions" className="hidden">Instructions</label>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={instructions.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {instructions.sort((a, b) => a.position - b.position).map((instruction, index) => (
                        <SortableInstruction
                            key={instruction.id}
                            instruction={instruction}
                            onUpdate={updateInstruction}
                            isLastEmpty={index === instructions.length - 1 && !instruction.instruction}
                        />
                    ))}
                </SortableContext>
            </DndContext>
            <input type="hidden" name="instructions" value={JSON.stringify(instructions)} />
        </div>
    )
} 