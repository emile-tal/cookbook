import { poppins } from "../fonts"

interface TertiaryButtonProps {
    text: string,
    onClick: () => void,
}

export default function TertiaryButton({ text, onClick }: TertiaryButtonProps) {
    return (
        <button
            className="flex items-center justify-center text-sm sm:text-base text-primary border border-primary hover:bg-primary/5 px-4 py-2 rounded-md transition-colors"
            onClick={onClick}
            type="button"
        >
            <span className={poppins.className}>{text}</span>
        </button>
    )
}