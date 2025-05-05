import { poppins } from "../fonts"

interface PrimaryButtonProps {
    text: string,
    onClick?: () => void,
    type: 'button' | 'submit',
    disabled?: boolean
}

export default function PrimaryButton({ text, onClick, type, disabled }: PrimaryButtonProps) {
    return (
        <button
            type={type}
            className="flex items-center justify-center text-sm sm:text-base px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
            onClick={onClick}
            disabled={disabled}
        >
            <span className={poppins.className}>{text}</span>
        </button>
    )
}