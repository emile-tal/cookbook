'use client'

import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { Instruction } from "@/app/types/definitions"
import { SortableInstruction } from './sortable-instruction'

interface InstructionsFormProps {
    instructions: Instruction[]
    setInstructions: (instructions: Instruction[]) => void
}

export default function InstructionsForm({ instructions, setInstructions }: InstructionsFormProps) {

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
            updatedInstructions.push({ position: position + 1, instruction: '' })
        }

        // Remove the last empty row if the previous row is now empty
        if (position === instructions.length - 1 && !instruction) {
            updatedInstructions = updatedInstructions.filter((_, idx) => idx !== updatedInstructions.length - 1)
        }

        setInstructions(updatedInstructions)
    }

    const removeInstruction = (position: number) => {
        const updatedInstructions = instructions
            .filter(inst => inst.position !== position)
            .map((inst, idx) => ({ ...inst, position: idx + 1 }))
        setInstructions(updatedInstructions)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            const oldIndex = instructions.findIndex((item) => item.position === active.id)
            const newIndex = instructions.findIndex((item) => item.position === over?.id)

            const newItems = arrayMove(instructions, oldIndex, newIndex)
            setInstructions(newItems.map((item, index) => ({ ...item, position: index + 1 })))
        }
    }

    return (
        <div>
            <label htmlFor="instructions" className="block text-sm font-medium mb-2">Instructions</label>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={instructions.map(i => i.position)}
                    strategy={verticalListSortingStrategy}
                >
                    {instructions.map((instruction, index) => (
                        <SortableInstruction
                            key={instruction.position}
                            instruction={instruction}
                            onUpdate={updateInstruction}
                            onRemove={removeInstruction}
                            isLastEmpty={index === instructions.length - 1 && !instruction.instruction}
                        />
                    ))}
                </SortableContext>
            </DndContext>
            <input type="hidden" name="instructions" value={JSON.stringify(instructions)} />
        </div>
    )
}
