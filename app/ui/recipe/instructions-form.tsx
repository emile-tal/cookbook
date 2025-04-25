'use client'

import { Instruction } from "@/app/types/definitions"
import dynamic from 'next/dynamic'

interface InstructionsFormProps {
    instructions: Instruction[]
    setInstructions: (instructions: Instruction[]) => void
}

const DynamicInstructionsForm = dynamic(() => import('./dynamic-instructions-form'), {
    ssr: false
})

export default function InstructionsForm(props: InstructionsFormProps) {
    return <DynamicInstructionsForm {...props} />
}
