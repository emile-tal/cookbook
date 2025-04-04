'use client'

import { useEffect, useRef } from 'react'

interface EditTitleProps {
    title: string
    onChange: (value: string) => void
    error?: string
}

export default function EditTitle({ title, onChange, error }: EditTitleProps) {
    const titleRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.style.width = 'auto'
            titleRef.current.style.width = `${Math.max(titleRef.current.scrollWidth, 300)}px`
        }
    }, [title])

    const handleTitleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.currentTarget
        onChange(input.value)
        input.style.width = 'auto'
        input.style.width = `${Math.max(input.scrollWidth, 300)}px`
    }

    return (
        <div className="w-full">
            <label htmlFor="title" className="hidden">Title</label>
            <input
                ref={titleRef}
                type="text"
                name="title"
                value={title}
                onChange={handleTitleInput}
                onInput={handleTitleInput}
                placeholder="Recipe title"
                className="text-2xl px-3 py-2 bg-background focus:outline-none focus:border-b-2 focus:border-secondary"
                style={{ minWidth: '300px' }}
            />
            {error && (
                <div className="text-red-500 text-sm">{error}</div>
            )}
        </div>
    )
} 