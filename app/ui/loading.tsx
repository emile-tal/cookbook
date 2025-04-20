type LoadingProps = {
    size: number
}

export default function Loading({ size }: LoadingProps) {

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className={`min-h-${size} min-w-${size} animate-spin rounded-full border-8 border-gray-300 border-t-gray-700`} />
            <div className="flex gap-1 text-lg font-medium text-gray-600">
                {"Loading...".split("").map((letter, index) => (
                    <span
                        key={index}
                        className="animate-fade-in"
                        style={{
                            animationDelay: `${index * 0.25}s`,
                            animationFillMode: "both"
                        }}
                    >
                        {letter}
                    </span>
                ))}
            </div>
        </div>
    )
} 