'use client'

import { CSS } from '@dnd-kit/utilities'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { Instruction } from "@/app/types/definitions"
import { useSortable } from '@dnd-kit/sortable'

interface SortableInstructionProps {
    instruction: Instruction
    onUpdate: (position: number, instruction: string) => void
    onRemove: (position: number) => void
    isLastEmpty: boolean
}

export function SortableInstruction({
    instruction,
    onUpdate,
    onRemove,
    isLastEmpty
}: SortableInstructionProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: instruction.id,
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
            {...attributes}
            {...listeners}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Tab') {
                    e.preventDefault()
                    const textareas = e.currentTarget.querySelectorAll('textarea')
                    const currentTextarea = document.activeElement
                    const currentIndex = Array.from(textareas).indexOf(currentTextarea as HTMLTextAreaElement)

                    if (e.shiftKey) {
                        if (currentIndex >= 0) {
                            textareas[currentIndex - 1].focus()
                        } else {
                            const prevRow = e.currentTarget.previousElementSibling
                            if (prevRow) {
                                const prevTextareas = prevRow.querySelectorAll('textarea')
                                prevTextareas[prevTextareas.length - 1].focus()
                            }
                        }
                    } else {
                        if (currentIndex < textareas.length - 1) {
                            textareas[currentIndex + 1].focus()
                        } else {
                            const nextRow = e.currentTarget.nextElementSibling
                            if (nextRow) {
                                const nextTextareas = nextRow.querySelectorAll('textarea')
                                nextTextareas[0].focus()
                            }
                        }
                    }
                }
            }}
        >
            <div className="col-span-1 flex items-center">
                <span className="text-xs sm:text-base">{instruction.position}.</span>
            </div>
            <textarea
                name={`instruction_${instruction.position}`}
                value={instruction.instruction}
                onChange={(e) => onUpdate(instruction.position, e.target.value)}
                className={`block min-w-full rounded-md border border-gray-300 px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base col-span-9 sm:col-span-10 focus-visible:ring-1 focus-visible:ring-primary focus:outline-none ${!instruction.instruction ? 'bg-gray-100' : 'bg-white'}`}
            />
            <div className="col-span-2 sm:col-span-1 flex justify-end items-center gap-1 sm:gap-2">
                {!isLastEmpty && <DragHandleIcon className="text-gray-400 text-lg sm:text-xl" />}
                <button
                    type="button"
                    onClick={() => onRemove(instruction.position)}
                    className="text-rose-300 hover:text-rose-500 flex justify-center items-center"
                    tabIndex={-1}
                >
                    <DeleteOutlineIcon className="text-lg sm:text-xl" />
                </button>
            </div>
        </div>
    )
} 