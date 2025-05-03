import { poppins } from "../fonts"

interface SecondaryButtonProps {
    text: string,
    onClick: () => void,
}

export default function SecondaryButton({ text, onClick }: SecondaryButtonProps) {
    return (
        <button
            className="flex items-center justify-center text-sm sm:text-base bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
            onClick={onClick}
            type="button"
        >
            <span className={poppins.className}>{text}</span>
        </button>
    )
}